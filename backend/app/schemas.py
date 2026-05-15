from pydantic import BaseModel
from typing import List, Optional

class RoomRequest(BaseModel):
    prompt: str
    width: Optional[float] = 10.0
    depth: Optional[float] = 10.0

class FurnitureInstruction(BaseModel):
    id: str
    type: str
    position: List[float]

class RoomResponse(BaseModel):
    width: float
    depth: float
    furniture: List[FurnitureInstruction]