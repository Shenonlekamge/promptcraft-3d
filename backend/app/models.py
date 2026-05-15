from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

class User(BaseModel):
    full_name: str
    email: EmailStr
    google_id: Optional[str] = None
    picture: Optional[str] = None

class FurnitureItem(BaseModel):
    id: str
    type: str
    position: List[float] 

class RoomLayout(BaseModel):
    user_id: str
    name: str
    width: float
    depth: float
    furniture: List[FurnitureItem]