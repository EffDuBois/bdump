from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import generate_embedding, generate_note

app = FastAPI()

origins = [
    "https://localhost:8000",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # for specific origins
    allow_credentials=True,    # for cookies
    allow_methods=["*"],       # for all http methods 
    allow_headers=["*"],       # for all headers
)

class createPrompt(BaseModel):
    query: str

# WORK IN PROGRESS
'''
class retrievePrompt(BaseModel):
    query: str
    vectoremb: list
    notes: list[str]
'''

@app.post("/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = generate_note(prompt.query)                  # returns markdown text for the prompt
    return {"embedding" : emb, "body" : ans} 
 




