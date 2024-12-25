import time
import numpy as np
from app.constants import GROK_API_KEY
from app.utils.aimath import cosinesim
from app.utils.prompts import CREATE_NOTES_PROMPT, ASK_NOTES_PROMPT
from app.logger import setup_logger
from fastapi import FastAPI, HTTPException
from openai import OpenAI

logger = setup_logger()

client = OpenAI(api_key=GROK_API_KEY, base_url="https://api.x.ai/v1")

def grok_create_note(user_input):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time

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
            attempt += 1
            logger.error(f"Grok attempt {attempt} failed: {e}")
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for Grok")
                raise HTTPException(status_code=503, detail="LLM API rate limit exceeded.")
            time.sleep(backoff_time)
            backoff_time = backoff_time * 2

def grok_ask_note(query, queryemb, notes, notesemb):
    MAX_RETRY = 3
    attempt = 0
    backoff_time = 1  # initial backoff time

    while attempt < MAX_RETRY:
        try:
            if query != "":
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
            attempt += 1
            logger.error(f"Grok attempt {attempt} failed: {e}")
            if attempt == MAX_RETRY:
                logger.error("Maximum retries reached for Grok")
                raise HTTPException(status_code=503, detail="LLM API rate limit exceeded.")
            time.sleep(backoff_time)
            backoff_time = backoff_time * 2