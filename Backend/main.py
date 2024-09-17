from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import generate_embedding, generate_note, ask_note

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
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


class askPrompt(BaseModel):
    query: str
    notes: list[str]
    notesemb: list

@app.post("/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = generate_note(prompt.query)                  # returns markdown text for the prompt
    return {"embedding" : emb, "body" : ans} 
 
@app.post("/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    ans = ask_note(prompt.query, emb, prompt.notes, prompt.notesemb)
    return {"body" : ans}





