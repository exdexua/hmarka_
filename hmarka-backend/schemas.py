from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class PostBase(BaseModel):
    title: str
    slug: str
    content_markdown: str
    category: Optional[str] = "General"
    status: Optional[str] = "draft"

class PostCreate(PostBase):
    author_id: int

class PostResponse(PostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)
