from fastapi import APIRouter
from Backend.app.utils.geminifunctions import generate_embedding, generate_note, ask_note
from app.utils.datavalidation import askPrompt, createPrompt
from dotenv import load_dotenv

load_dotenv()   
 
router = APIRouter()

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