from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from ai import generate_embedding, generate_note, ask_note

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
    "http://dev-ainotetaker.vercel.app",
    "http://ainotetaker.vercel.app"
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

class NoteEmbedding(BaseModel):
    note: str
    embedding: List[float]

class askPrompt(BaseModel):
    query: str
    data: List[NoteEmbedding]


@app.post("/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = generate_note(prompt.query)                  # returns markdown text for the prompt
    return {"title": ans[0], "body" : ans[1], "embedding" : emb} 
 
@app.post("/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    notes = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb, notes, notesemb)
    return {"body" : ans}
      


