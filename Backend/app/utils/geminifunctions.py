import os
import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.utils.aimath import cosinesim
from app.utils.prompts import title_prompt, generate_note_prompt, ask_note_prompt
from logger import setup_logger
from dotenv import load_dotenv

load_dotenv()

logger = setup_logger()

def generate_embedding(query):
    if (query != ""):
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))
        vector = embeddings.embed_query(query)
        return vector
    else:
        return ['empty query']
    

def llm(system_prompt, user_input):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            parser = StrOutputParser()
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2, max_toxens=500)
            prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", system_prompt),
                    ("user", "{input}"),
                ]
            )
            chain = prompt | llm | parser
            return chain.invoke({"input": user_input})
        except Exception as e:
            attempt += 1
            if attempt == MAX_RETRY:
                logger.error("maximum retries reached for llm")
                return "max retries attempted, couldnt fetch response from llm"


def find_title(body):
    if (body != ""):
        system_prompt = title_prompt
        return llm(system_prompt, body)   
    else:
        return "title couldnt be fetched due to empty body"


def generate_note(query):
    if (query != ""):
        system_prompt = generate_note_prompt
        body = llm(system_prompt, query)
        if (body==""):
            body = query
        title = find_title(body)
        title = title.replace("\n", "")
        return [title, body]
    else:
        return "empty query"
    
    
def ask_note(query, queryemb, notes, notesemb):
    MAX_RETRY = 3
    attempt = 0
    while attempt < MAX_RETRY:
        try:
            if (query != ""):
                similarities = [cosinesim(queryemb, noteemb) for noteemb in notesemb]
                most_relevant_note_index = np.argmax(similarities)
                relevant_note = notes[most_relevant_note_index]
                parser = StrOutputParser()
                llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2, max_tokens=500)
                system_prompt = ask_note_prompt
                prompt = ChatPromptTemplate.from_messages(
                    [
                        ("system", system_prompt),
                        ("user", "Note: {reference_note}\nQuery: {input}"),
                    ]
                )
                chain = prompt | llm | parser
                answer = chain.invoke({"reference_note": relevant_note, "input": query})
                return answer
            else:
                return "empty query"
        except Exception as e:
            attempt += 1
            if attempt == MAX_RETRY:
                logger.error("maximum retries reached for llm")
                return "max retries attempted, couldnt fetch response from llm"