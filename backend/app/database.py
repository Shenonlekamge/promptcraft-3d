import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

if not MONGO_DETAILS:
    print("ERROR: MONGODB_URL not found in .env file!")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

db = client.promptcraft_3d

user_collection = db.get_collection("users")
room_collection = db.get_collection("rooms")

print("MongoDB connection initialized.")