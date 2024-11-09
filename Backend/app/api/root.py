from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from pydantic import BaseModel
from app.utils.ai import generate_embedding, generate_note, ask_note

router = APIRouter()

class createPrompt(BaseModel):
    query: str

class NoteEmbedding(BaseModel):
    id: int
    path: str
    note: str
    embedding: List[float]

class askPrompt(BaseModel):
    query: str
    data: List[NoteEmbedding]


@router.post("/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = generate_note(prompt.query)                  # returns markdown text for the prompt
    return {"title": ans[0], "body" : ans[1], "embedding" : emb} 


@router.post("/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    notes = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb, notes, notesemb)
    return {"body" : ans}