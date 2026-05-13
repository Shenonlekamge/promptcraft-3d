from pydantic import BaseModel
from typing import List, Optional

# The user's request (e.g., "A modern living room")
class RoomRequest(BaseModel):
    prompt: str
    width: Optional[float] = 10.0
    depth: Optional[float] = 10.0

# A single piece of furniture the AI wants to place
class FurnitureInstruction(BaseModel):
    id: str
    type: str # This MUST match your manifest.json types (e.g., 'bedDouble')
    position: List[float] # [x, y, z]

# The full response sent back to React
class RoomResponse(BaseModel):
    width: float
    depth: float
    furniture: List[FurnitureInstruction]