import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load variables from your .env file
load_dotenv()

# Get the connection string from .env
MONGO_DETAILS = os.getenv("MONGODB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

if not MONGO_DETAILS:
    print("ERROR: MONGODB_URL not found in .env file!")

# Create the client and connect to the database
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

# Database name
db = client.promptcraft_3d

# Collection References (Think of these as tables)
user_collection = db.get_collection("users")
room_collection = db.get_collection("rooms")

print("MongoDB connection initialized.")