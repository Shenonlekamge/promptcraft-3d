from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from .auth import verify_google_token
from .database import user_collection
import datetime
import hashlib
import secrets
from typing import Optional

app = FastAPI(title="PromptCraft 3D API")

# ---------------------------------------------------------------------------
# 1. CORS Configuration
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# 2. Helpers
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    """SHA-256 hash a password with a random salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{hashed}"


def verify_password(password: str, stored: str) -> bool:
    """Verify a plain password against a stored salt:hash string.
    Falls back to plain-text comparison for legacy entries."""
    if ":" in stored:
        salt, hashed = stored.split(":", 1)
        return hashlib.sha256((salt + password).encode()).hexdigest() == hashed
    # Legacy plain-text fallback (for accounts created before this fix)
    return password == stored


# ---------------------------------------------------------------------------
# 3. Pydantic Models (Request Schemas)
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GenerationRequest(BaseModel):
    prompt: str
    room_dimensions: Optional[dict] = {"width": 12, "depth": 12}

# ---------------------------------------------------------------------------
# 4. Health Check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

# ---------------------------------------------------------------------------
# 5. Authentication Routes
# ---------------------------------------------------------------------------

@app.post("/auth/register")
async def register_user(user: UserRegister):
    # Validate password length
    if len(user.password) < 6:
        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    # Check if email is already taken
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "full_name": user.full_name,
        "email": user.email,
        "password": hash_password(user.password),   # stored hashed
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


# ---------------------------------------------------------------------------
# 6. Core App Routes
# ---------------------------------------------------------------------------

@app.post("/generate-layout")
async def generate_layout(request: GenerationRequest):
    print(f"AI Prompt received: {request.prompt}")
    # TODO: replace with real AI generation logic
    return {"layout": []}