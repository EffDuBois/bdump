from fastapi import APIRouter
from app.utils.geminifunctions import generate_embedding, create_note, ask_note
from app.utils.datavalidation import askPrompt, createPrompt
from app.logger import setup_logger
from dotenv import load_dotenv

load_dotenv()   
 
router = APIRouter()

logger = setup_logger()

@router.post("/api/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = create_note(prompt.query)                  # returns markdown text for the prompt
    logger.info(f"note created with title: {ans}" )
    return {"response": ans, "embedding" : emb} 


@router.post("/api/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    notes_text = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb, notes_text, notesemb)
    logger.info(f"answer for query: {ans}")
    return {"body" : ans}