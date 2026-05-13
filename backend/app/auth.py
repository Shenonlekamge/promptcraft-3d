from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

def verify_google_token(token: str):
    try:
        # Ask Google if this token is legit
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        # If it is, return the user's Google info
        return {
            "email": idinfo['email'],
            "full_name": idinfo.get('name'),
            "picture": idinfo.get('picture'),
            "google_id": idinfo['sub']
        }
    except ValueError:
        # Token was invalid (expired or fake)
        return None