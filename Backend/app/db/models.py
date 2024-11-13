from pydantic import BaseModel

class Notes(BaseModel):
    notes_text: str
    notes_embeddings: list[float]

class User(BaseModel):
    authid: str
    notes: Notes