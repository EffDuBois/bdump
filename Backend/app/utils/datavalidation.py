from pydantic import BaseModel

class createPrompt(BaseModel):
    query: str
    # iscontext: bool

class NoteEmbedding(BaseModel):
    id: int
    path: str
    note: str
    embedding: list[float]

class askPrompt(BaseModel):
    query: str
    data: list[NoteEmbedding]
