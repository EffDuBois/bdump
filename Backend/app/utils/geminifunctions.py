import os
import numpy as np
from app.logger import setup_logger
from app.utils.aimath import cosinesim
from app.utils.prompts import ASK_NOTES_PROMPT, CREATE_NOTES_PROMPT
from dotenv import load_dotenv
from fastapi import HTTPException
from google.generativeai import chat, embeddings    

load_dotenv()

chat.configure(api_key=os.getenv("GOOGLE_API_KEY"))

logger = setup_logger()

def generate_embedding(query):
    if (query != ""):
        client = embeddings.EmbeddingsClient(api_key=os.getenv("GOOGLE_API_KEY"))
        response = client.embed_text(query)
        vector = response['embeddings']
        return vector
    else:
        return ['empty query']
    
def create_note(query):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                messages = [
                    {'role': 'system', 'content': CREATE_NOTES_PROMPT},
                    {'role': 'user', 'content': query}
                ]
                # Make the API call
                response = chat.ChatModel.predict(
                    model="gemini-1.5-flash",
                    messages=messages,
                    temperature=0.2,
                    max_output_tokens=500
                )

                # Extract the response content
                if response and response.get("candidates"):
                    answer = response["candidates"][0]["content"]
                    return answer
                else:
                    raise HTTPException(status_code=503, detail="Empty response from Gemini API.")
            else:
                return "empty query"
        except Exception as e:
            if "Resource has been exhausted" in str(e):
                raise HTTPException(
                    status_code=503,
                    detail="Gemini API rate limit exceeded."
                )
            attempt += 1
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for LLM.")
                raise HTTPException(
                    status_code=503,
                    detail="Gemini API rate limit exceeded."
                ) 
        
def ask_note(query, queryemb, notes, notesemb):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                similarities = [cosinesim(queryemb, noteemb) for noteemb in notesemb]
                most_relevant_note_index = np.argmax(similarities)
                relevant_note = notes[most_relevant_note_index]
                messages = [
                    {"role": "system", "content": ASK_NOTES_PROMPT},
                    {"role": "user", "content": f"Note: {relevant_note}\nQuery: {query}"}
                ]
                # Make the API call
                response = chat.ChatModel.predict(
                    model="gemini-1.5-flash",
                    messages=messages,
                    temperature=0.2,
                    max_output_tokens=500
                )

                # Extract the response content
                if response and response.get("candidates"):
                    answer = response["candidates"][0]["content"]
                    return answer
                else:
                    raise HTTPException(status_code=503, detail="Empty response from Gemini API.")
            else:
                return "empty query"
        except Exception as e:
            if "Resource has been exhausted" in str(e):
                raise HTTPException(
                    status_code=503,
                    detail="Gemini API rate limit exceeded."
                )
            attempt += 1
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for LLM.")
                raise HTTPException(
                    status_code=503,
                    detail="Gemini API rate limit exceeded."
                ) 