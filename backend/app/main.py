from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

from .database import engine, Base, get_db
from . import models, schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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


# Get all chat messages
@app.get("/chat/", response_model=List[schemas.ChatMessageResponse])
def get_chat_history(db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).order_by(models.ChatMessage.timestamp).all()
    return messages