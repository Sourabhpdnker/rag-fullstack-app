from pydantic import BaseModel
from datetime import datetime


# Used when creating a message (from frontend)
class ChatMessageCreate(BaseModel):
    content: str


# Used when returning messages to frontend
class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime

    class Config:
        orm_mode = True