from pydantic import BaseModel
import typing_extensions as typing

class createPrompt(BaseModel):
    query: str

class NoteEmbedding(BaseModel):
    id: int
    path: str
    note: str
    embedding: list[float]

class askPrompt(BaseModel):
    query: str
    data: list[NoteEmbedding]

class createOutput(typing.TypedDict):
    body: str
    title: str

class askOutput(typing.TypedDict):
    response: str