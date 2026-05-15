from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from .auth import verify_google_token
from .database import user_collection
import datetime
import hashlib
import secrets
from typing import Optional, List
import json
import os
import uuid
from openai import AsyncOpenAI
from dotenv import load_dotenv
from pydantic import Field

load_dotenv()
aclient = AsyncOpenAI()
app = FastAPI(title="PromptCraft 3D API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, stored: str) -> bool:
    if ":" in stored:
        salt, hashed = stored.split(":", 1)
        return hashlib.sha256((salt + password).encode()).hexdigest() == hashed
    return password == stored

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GenerationRequest(BaseModel):
    prompt: str
    room_dimensions: Optional[dict] = Field(default_factory=lambda: {"width": 12, "depth": 12})
    available_assets: Optional[List[str]] = Field(default_factory=list)

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

@app.post("/auth/register")
async def register_user(user: UserRegister):
    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "full_name": user.full_name,
        "email": user.email,
        "password": hash_password(user.password),
        "method": "manual",
        "created_at": datetime.datetime.utcnow().isoformat(),
    }

    await user_collection.insert_one(user_doc)
    return {"message": "Registration successful! Please log in."}

@app.post("/auth/login")
async def login_user(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})

    if not db_user or not verify_password(user.password, db_user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "email": db_user["email"],
            "full_name": db_user.get("full_name", "User"),
            "picture": db_user.get("picture"),
        },
    }

@app.post("/auth/google")
async def google_auth(payload: dict = Body(...)):
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    user_info = verify_google_token(token)

    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    existing_user = await user_collection.find_one({"google_id": user_info["google_id"]})

    if not existing_user:
        user_doc = {
            "full_name": user_info["full_name"],
            "email": user_info["email"],
            "picture": user_info["picture"],
            "google_id": user_info["google_id"],
            "method": "google",
            "created_at": datetime.datetime.utcnow().isoformat(),
        }
        await user_collection.insert_one(user_doc)

    return {"message": "Login successful", "user": user_info}

@app.post("/generate-layout")
async def generate_layout(request: GenerationRequest):
    if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "your_openai_api_key_here":
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
    system_prompt = f"""You are a 3D room layout generator.
Given a user prompt for a room layout, you must determine the room type, suggested dimensions, and an array of furniture items.
CRITICAL INSTRUCTION: You are ONLY allowed to use the following exact strings for the "type" field:
{', '.join(request.available_assets) if request.available_assets else 'any'}
DO NOT use any asset type that is not in this exact list. If you need a bed and only 'bedDouble' is available, you MUST use 'bedDouble'.

Coordinate system:
- Room center is (0, 0, 0)
- Width is X axis, Depth is Z axis.
- Y is always 0 for furniture on the floor.
- Rotation is Y-axis in degrees (0, 90, 180, 270). 0 faces +Z (camera).
- Furniture positions should be within the room dimensions width x depth, avoid overlapping.
- Please place a RICH, DETAILED layout. DO NOT just place a few items. A standard room should have 6 to 12 items.
- If generating a bedroom, it MUST include at least: a bed, a bedside cabinet (or nightstand), a table/desk, a chair, an almirah/cupboard, and a mirror (assuming they exist in the assets list).
- Ensure all items are logically placed (e.g., bed against a wall, chair facing the table, mirror on a wall) and have CORRECT Y-axis rotations so they face the right directions.
- If placing a television, ALWAYS place a 'cabinetTelevision' (or similar cabinet) first, and place the 'television' exactly on top of it by setting the television's Y position to something like 0.6. Do NOT place televisions directly on the floor (Y=0).
- Use variety. Fill the space logically without cluttering it.

Respond in JSON format ONLY:
{{
  "roomType": "bedroom",
  "roomUpdates": {{
    "width": 12,
    "depth": 12,
    "height": 3,
    "floorColor": "#8B7355",
    "wallColor": "#F5F0E8"
  }},
  "furniture": [
    {{ "type": "bedDouble", "position": [0, 0, -3.5], "rotation": 0 }}
  ]
}}
"""

    try:
        response = await aclient.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
        result = json.loads(content or "{}")
        
        for item in result.get("furniture", []):
            if "id" not in item:
                item["id"] = str(uuid.uuid4())[:8]
            if "color" not in item:
                item["color"] = "#3895D3"
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate layout")