from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from chromadb import Client
from chromadb.config import Settings
from app.services.vectorstore import get_vector_store
from .database import get_db

from .services.document_loader import ingest_pdf
from .services.rag_pipeline import run_rag

from .database import engine, Base, get_db
from . import models, schemas
from .llm import ask_llm

app = FastAPI()

# CORS for Vite (port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables automatically
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Backend running with SQLite 🚀"}


# Get chat history
@app.get("/chat/", response_model=List[schemas.ChatMessageResponse])
def get_chat_history(db: Session = Depends(get_db)):
    messages = (
        db.query(models.ChatMessage)
        .order_by(models.ChatMessage.timestamp)
        .all()
    )
    return messages


# Ask plain LLM (no RAG)
@app.post("/ask/")
def ask_ai(message: schemas.ChatMessageCreate):
    reply = ask_llm(message.content)
    return {"response": reply}


# Upload PDF and ingest
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_location = f"temp_{file.filename}"

        with open(file_location, "wb") as f:
            f.write(await file.read())

        chunk_count = ingest_pdf(file_location)

        if chunk_count == 0:
            raise HTTPException(status_code=400, detail="No content extracted from PDF.")

        return {"message": "Document ingested", "chunks": chunk_count}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Ask RAG
@app.post("/rag/", response_model=schemas.ChatMessageResponse)
def ask_rag(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db)
):
    try:
        if not message.content.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty.")

        # Save user message
        user_message = models.ChatMessage(
            role="user",
            content=message.content
        )
        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        # Generate RAG response
        answer_text = run_rag(message.content)

        if not answer_text:
            raise HTTPException(status_code=400, detail="No response generated.")

        # Save assistant message
        ai_message = models.ChatMessage(
            role="assistant",
            content=answer_text
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)

        return ai_message

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/reset-chat/")
def reset_chat(db: Session = Depends(get_db)):
    db.query(models.ChatMessage).delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}    


@app.post("/reset-knowledge/")
def reset_knowledge():
    vectorstore = get_vector_store()
    vectorstore.delete_collection()
    return {"message": "Knowledge cleared successfully."}