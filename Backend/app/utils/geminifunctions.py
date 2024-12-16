import os
import numpy as np
import time
from app.logger import setup_logger
from app.utils.aimath import cosinesim
from app.utils.grokfunctions import grok_ask_note, grok_create_note
from app.utils.prompts import ASK_NOTES_PROMPT, CREATE_NOTES_PROMPT
from dotenv import load_dotenv
from fastapi import HTTPException
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

logger = setup_logger()

def generate_embedding(query):
    if (query != ""):
        response = genai.embed_content(model="models/text-embedding-004", content=query)
        return response
    else:
        return ['empty query']
    
def create_note(query):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time 

    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                messages = [
                    {'role': 'system', 'content': CREATE_NOTES_PROMPT},
                    {'role': 'user', 'content': query}
                ]
                response = genai.generate_text(
                    model="gemini-1.5-flash",
                    messages=messages,
                    temperature=0.2,
                    max_output_tokens=500
                )
                return response
            else:
                return "empty query"
        except Exception as e:
            attempt += 1
            logger.error(f"Attempt {attempt} failed: {e}")
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for Gemini, shifting to Grok.")
                grok_create_response = grok_create_note(query) 
                return grok_create_response 
            time.sleep(backoff_time)
            backoff_time = backoff_time * 2
            
def ask_note(query, queryemb, notes, notesemb):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time

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
                response = genai.generate_text(
                    model="gemini-1.5-flash",
                    messages=messages,
                    temperature=0.2,
                    max_output_tokens=500
                )
                return response
            else:
                return "empty query"
        except Exception as e:
            attempt += 1
            logger.error(f"Attempt {attempt} failed: {e}")
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for Gemini, shifting to Grok.")
                grok_ask_response = grok_ask_note(query, queryemb, notes, notesemb) 
                return grok_ask_response 
            time.sleep(backoff_time)
            backoff_time = backoff_time * 2