import os
import numpy as np
from app.utils.aimath import cosinesim
from app.utils.prompts import CREATE_NOTES_PROMPT, ASK_NOTES_PROMPT
from app.logger import setup_logger
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI

load_dotenv()

logger = setup_logger()

client = OpenAI(api_key=os.getenv("GROK_API_KEY"), base_url="https://api.x.ai/v1")

def grok_create_note(user_input):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            messages = [
                    {'role': 'system', 'content': CREATE_NOTES_PROMPT},
                    {'role': 'user', 'content': user_input}
                ]
            completion = client.chat.completions.create(
                model="grok-beta",
                messages=messages,
                temperature=0.2,
                max_tokens=500
            )
            response = completion.choices[0].message.content
            return response    

        except Exception as e:
            if "Resource has been exhausted" in str(e):  
                raise HTTPException(
                    status_code=429, 
                    detail="Gemini API rate limit exceeded. Please try again later."
                )
            attempt += 1
            if attempt == MAX_RETRY:
                logger.error("maximum retries reached for llm")
                return "max retries attempted, couldnt fetch response from llm"


def grok_ask_note(query, queryemb, notes, notesemb):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                similarities = [cosinesim(queryemb, noteemb) for noteemb in notesemb]
                most_relevant_note_index = np.argmax(similarities)
                relevant_note = notes[most_relevant_note_index]
                
                messages = [
                    {'role': 'system', 'content': ASK_NOTES_PROMPT},
                    {'role': 'user', 'content': f"Note: {relevant_note}\nQuery: {query}"}
                ]
                completion = client.chat.completions.create(
                    model="grok-beta",
                    messages=messages,
                    temperature=0.2,
                    max_tokens=500
                )
                response = completion.choices[0].message.content
                return response
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
                logger.error("maximum retries reached for llm")
                raise HTTPException(status_code=503, detail="Gemini API rate limit exceeded.")
                #return "max retries attempted, couldnt fetch response from llm"
