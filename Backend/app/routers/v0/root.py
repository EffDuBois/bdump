from fastapi import APIRouter
from app.utils.geminifunctions import generate_embedding, create_note, ask_note, edit_note
from app.utils.datavalidation import askPrompt, createPrompt, editPrompt
from app.logger import setup_logger
from pymongo import MongoClient
from dotenv import load_dotenv
import os
router = APIRouter()

logger = setup_logger()

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["BrainDump_Mixer"]
create_collection = db["create"]
ask_collection = db["ask"]
edit_collection = db["edit"]

@router.post("/notes/create")
async def create_notes(prompt: createPrompt):       
    emb = generate_embedding(prompt.query)             # returns vector embedding for the prompt
    ans = create_note(prompt.query)                  # returns markdown text for the prompt
    logger.info(f"note created with title: {ans}" )
    data = {
        'input-text': prompt.query,
        'processed-text': ans
    }
    create_collection.insert_one({'query': data})
    output = {**ans, **emb}
    return output

@router.post("/notes/ask")
async def ask_notes(prompt: askPrompt):
    emb = generate_embedding(prompt.query)
    notes_text = [i.note for i in prompt.data]
    notesemb = [i.embedding for i in prompt.data]
    ans = ask_note(prompt.query, emb["embedding"], notes_text, notesemb)
    logger.info(f"answer for query: {ans}")
    data = {
        'input-text': prompt.query,
        'processed-text': ans
    }
    ask_collection.insert_one({'query': data})
    return ans

@router.post("/notes/edit")
async def edit_notes(prompt: editPrompt):       
    user_note = prompt.note
    query = prompt.query
    ans = edit_note(user_note, query)  
    emb = generate_embedding(ans.get('note'))                   
    logger.info(f"note edited with title: {ans}" )
    data = {
        'input-text': prompt.query,
        'processed-text': ans
    }
    edit_collection.insert_one({'query': data})
    output = {**ans, **emb}
    return output
