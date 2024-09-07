from fastapi import FastAPI
from pydantic import BaseModel
from ai import generate_embedding, generate_note

app = FastAPI()

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
 