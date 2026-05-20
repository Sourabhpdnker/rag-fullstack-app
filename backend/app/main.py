from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, auth
from .database import engine, get_db
from .services.document_loader import ingest_pdf
from .services.rag_pipeline import run_rag
from .llm import ask_llm

app = FastAPI()

# CORS configuration - This is all you need!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Backend running with Authentication 🔐"}

# ============ AUTHENTICATION ENDPOINTS ============

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # Validate password length
        if len(user.password) > 72:
            # Truncate or reject?
            # Option 1: Reject with message
            raise HTTPException(
                status_code=400,
                detail="Password too long. Maximum 72 characters allowed."
            )
            # Option 2: Auto-truncate (uncomment the line below and comment the raise above)
            # user.password = user.password[:72]
        
        # Check if user exists
        existing_user = db.query(models.User).filter(
            (models.User.email == user.email) | (models.User.username == user.username)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email or username already registered"
            )
        
        # Create new user
        hashed_password = auth.get_password_hash(user.password)
        db_user = models.User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Create token
        access_token = auth.create_access_token(data={"sub": db_user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": db_user
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        authenticated_user = auth.authenticate_user(db, user.email, user.password)
        
        if not authenticated_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        access_token = auth.create_access_token(data={"sub": authenticated_user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": authenticated_user
        }
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.post("/api/auth/logout")
def logout():
    return {"message": "Successfully logged out"}

# ============ CHAT ENDPOINTS ============

@app.get("/chat/", response_model=List[schemas.ChatMessageResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.timestamp).all()
    return messages

@app.post("/ask/")
def ask_ai(
    message: schemas.ChatMessageCreate,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    reply = ask_llm(message.content)
    return {"response": reply}

@app.post("/rag/", response_model=schemas.ChatMessageResponse)
def ask_rag(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    try:
        if not message.content.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty.")
        
        # Save user message
        user_message = models.ChatMessage(
            role="user",
            content=message.content,
            user_id=current_user.id
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)
        
        # Generate RAG response
        answer_text = run_rag(message.content)
        
        if not answer_text:
            answer_text = "I couldn't generate a response. Please try again."
        
        # Save assistant message
        ai_message = models.ChatMessage(
            role="assistant",
            content=answer_text,
            user_id=current_user.id
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)
        
        return ai_message
        
    except Exception as e:
        print(f"RAG error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        chunk_count = ingest_pdf(file_location)
        
        if chunk_count == 0:
            raise HTTPException(status_code=400, detail="No content extracted from PDF.")
        
        return {"message": "Document ingested", "chunks": chunk_count}
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reset-chat/")
def reset_chat(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).delete()
    db.commit()
    return {"message": "Your chat history cleared successfully"}

@app.post("/reset-knowledge/")
def reset_knowledge():
    from .services.vectorstore import get_vector_store
    vectorstore = get_vector_store()
    vectorstore.delete_collection()
    return {"message": "Knowledge cleared successfully."}