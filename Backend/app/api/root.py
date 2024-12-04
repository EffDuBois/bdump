from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from pydantic import BaseModel
from app.utils.ai import generate_embedding, generate_note, ask_note
from app.db.config import collection_name
from app.db.models import User
from app.db.schemas import list_serial
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()   
 
router = APIRouter()

"""
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


@router.post("/api/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = generate_note(prompt.query)                  # returns markdown text for the prompt
    return {"title": ans[0], "body" : ans[1], "embedding" : emb} 


@router.post("/api/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    notes_text = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb, notes_text, notesemb)
    return {"body" : ans}
"""


class createNote(BaseModel):
    authid: str | None = "1234"
    query: str
    
class askNote(BaseModel):
    authid: str | None = "1234"
    query: str
    
@router.get("/api/")
async def read_root():
    return {"title": "Bdump", "body": "this is the backend endpoint for brain dump"}

@router.post("/api/notes/create")
async def create_note(prompt: createNote):
    emb = generate_embedding(prompt.query)
    ans = generate_note(prompt.query)
    notes = {
        "notes_text" : ans,
        "notes_embeddings": emb 
    }
    user_entrant = {
        "authid": prompt.authid,
        "notes": notes
    }
    if prompt.authid == "1234":
        collection_name.find_one_and_update({"authid": prompt.authid}, {"$set": dict(user_entrant)})
    else:
        collection_name.insert_one(dict(user_entrant))
    return {"title": ans[0], "body": ans[1]}


@router.post("/api/notes/ask")
async def ask_notes(prompt: askNote):
    emb = generate_embedding(prompt.query)
    users = list_serial(collection_name.find())
    notes_text = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb, notes_text, notesemb)
    return {"body" : ans}






