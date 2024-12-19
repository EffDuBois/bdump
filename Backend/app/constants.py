import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

API_KEY = os.getenv("API_KEY")
externalCors =  os.getenv("FRONTEND_URL")
GROK_API_KEY=os.getenv("GROK_API_KEY")
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

ENV_VARIABLES = [API_KEY, externalCors, GROK_API_KEY, GOOGLE_API_KEY, MONGO_URI, ADMIN_TOKEN]

for key in ENV_VARIABLES:
    if not key:
        raise HTTPException(status_code=503, detail=f"env variables not configured properly")