import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api import root

load_dotenv()
externalCors =  os.getenv("FRONTEND_URL")

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "https://bdump.vercel.app",
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

      


