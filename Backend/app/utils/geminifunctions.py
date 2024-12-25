import numpy as np
import json
import time
from app.constants import GOOGLE_API_KEY
from app.logger import setup_logger
from app.utils.aimath import cosinesim
from app.utils.datavalidation import askOutput, createOutput
from app.utils.grokfunctions import grok_ask_note, grok_create_note
from app.utils.prompts import ASK_NOTES_PROMPT, CREATE_NOTES_PROMPT, EDIT_NOTE_PROMPT
from fastapi import HTTPException
import google.generativeai as genai

genai.configure(api_key=GOOGLE_API_KEY)

logger = setup_logger()

def generate_embedding(query):
    if (query != ""):
        response = genai.embed_content(model="models/text-embedding-004", content=query)
        return response
    else:
        return {'response': 'empty query'}
    
def create_note(query):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time 

    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                messages = f"system: {CREATE_NOTES_PROMPT}\nuser: {query}"
                model = genai.GenerativeModel("gemini-1.5-pro-latest")
                result = model.generate_content(
                    messages,
                    generation_config=genai.GenerationConfig(
                        temperature=0.2,      
                        max_output_tokens=300,
                        response_mime_type="application/json", response_schema=list[createOutput]
                    ),
                )
                raw_output = result.candidates[0].content.parts[0].text  
                output = json.loads(raw_output) 
                return output[0]
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
                
                messages = f"system: {ASK_NOTES_PROMPT}\nuser: (Note: {relevant_note}, Query:{query})"
                model = genai.GenerativeModel("gemini-1.5-pro-latest")
                result = model.generate_content(
                    messages,
                    generation_config=genai.GenerationConfig(
                        temperature=0.2,      
                        max_output_tokens=300,
                        response_mime_type="application/json", response_schema=list[askOutput]
                    ),
                )
                raw_output = result.candidates[0].content.parts[0].text  
                output = json.loads(raw_output) 
                return output[0]
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

def edit_note(editinput):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time
    query= editinput.title
    note=editinput.note


    while attempt < MAX_RETRY:
        try:
            if (note != ""):
                messages = f"system: {EDIT_NOTE_PROMPT}\nuser: (Note: {note}, Query:{query})"
                model = genai.GenerativeModel("gemini-1.5-pro-latest")
                result = model.generate_content(
                    messages,
                    generation_config=genai.GenerationConfig(
                        temperature=0.2,      
                        max_output_tokens=300,
                        response_mime_type="application/json", response_schema=list[createOutput]
                    ),
                )
                raw_output = result.candidates[0].content.parts[0].text  
                output = json.loads(raw_output) 
                return output[0]
            else:
                return "empty query"
        except Exception as e:
            attempt += 1
            logger.error(f"Attempt {attempt} failed: {e}")
            
            if attempt == MAX_RETRY:
                raise HTTPException(status_code=503,detail="llm api is exhausted")
            time.sleep(backoff_time)
            backoff_time = backoff_time * 2