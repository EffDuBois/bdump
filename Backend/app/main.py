import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api import root

load_dotenv()

API_KEY = os.getenv("API_KEY")

async def verify_key(request: Request):
    api_key = request.headers.get("x_token")
    if api_key != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid or missing API key",
        )
    
app = FastAPI(dependencies=[Depends(verify_key)])

externalCors =  os.getenv("FRONTEND_URL")

origins = [
    f"{externalCors}"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # for specific origins
    allow_credentials=True,    # for cookies
    allow_methods=["*"],       # for all http methods 
    allow_headers=["*"],       # for all headers
)

app.include_router(root.router)