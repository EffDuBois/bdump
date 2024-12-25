from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import root
from app.beta import betabuilder
from app.constants import API_KEY, externalCors
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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

@app.get("/")
async def greet_function():
    return "your mom"

app.include_router(root.router)
app.include_router(betabuilder.betasetup)
