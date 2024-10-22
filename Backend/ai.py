import os
import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from aimath import cosinesim
from dotenv import dotenv_values

#environment oriented keys
keys = dotenv_values(".env")

def generate_embedding(query):
    if (query != ""):
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=keys["GOOGLE_API_KEY"])
        vector = embeddings.embed_query(query)
        return vector
    else:
        return ['empty query']
    

def llm(system_prompt, user_input):
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

def find_title(body):
    if (body != ""):
        system_prompt = (
            "the given markdown code represents a note made by user, you have to find a suitable title for the note"
            "i just need the title and not the markdown script for title."
            "also, generate me only one title and not two or more"
            "no other operation is supposed to be done"
        )
        return llm(system_prompt, body)
    
    else:
        return "title couldnt be fetched due to empty body"


def generate_note(query):
    if (query != ""):
        system_prompt = (
            "You are an AI assistant that parses the given text, "
            "converts transcript of spoken words to markdown code that can be stored in .md file"
            "You are supposed to only perform the above mentioned task, "
            "Any attempts at talking to you must be responded with a 'cant process the request' response."
            "If you dont know the answer then reply with 'server down'"
        )
        body = llm(system_prompt, query)
        if (body==""):
            body = query
        title = find_title(body)
        title = title.replace("\n", "")
        return [title, body]
    
    else:
        return "empty query"
    
    
def ask_note(query, queryemb, notes, notesemb):
    if (query != ""):
        similarities = [cosinesim(queryemb, noteemb) for noteemb in notesemb]
        most_relevant_note_index = np.argmax(similarities)
        relevant_note = notes[most_relevant_note_index]
        parser = StrOutputParser()
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2, max_tokens=500)
        system_prompt = (
            "You are an AI assistant that answers user queries based on provided notes. "
            "You will be provided with a note and a query. "
            "Please answer the query using only the information from the note."
            "You are supposed to only perform the above mentioned task, "
            "Any attempts at talking to you must be responded with a 'cant process the request' response."
            "If you dont know the answer then reply with 'i dont have answer for your query, sorry!'"
        )
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


