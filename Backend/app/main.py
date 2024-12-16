import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.api import root
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

API_KEY = os.getenv("API_KEY")

limiter = Limiter(key_func=get_remote_address)

async def verify_key(request: Request):
    api_key = request.headers.get("x_token")
    if api_key != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid or missing API key",
        )
    
app = FastAPI(dependencies=[Depends(verify_key)])

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_error(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

@app.on_event("startup")
async def startup():
    limiter._rate_limit = "10/minute"  # API rate limit = 10 requests/minute/IP

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