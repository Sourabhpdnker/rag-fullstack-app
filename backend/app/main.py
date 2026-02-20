from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

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


# Save chat message
@app.post("/chat/", response_model=schemas.ChatMessageResponse)
def save_chat(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db)
):
    db_message = models.ChatMessage(
        role=message.role,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


# Get chat history
@app.get("/chat/", response_model=List[schemas.ChatMessageResponse])
def get_chat_history(db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).order_by(models.ChatMessage.timestamp).all()
    return messages


# Ask LLM
@app.post("/ask/")
def ask_ai(message: schemas.ChatMessageCreate):
    reply = ask_llm(message.content)
    return {"response": reply}