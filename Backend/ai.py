import os
import numpy as np
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

load_dotenv()

def generate_embedding(query):
    if (query != ""):
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))
        vector = embeddings.embed_query(query)
        return vector
        #print(vector[:5])
    else:
        return ['empty query']


def generate_note(query):
    if (query != ""):
        parser = StrOutputParser()
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2, max_toxens=500)
        system_prompt = (
            "You are an AI assistant that parses the given text, "
            "converts transcript of spoken words to markdown code that can be stored in .md file"
            "You are supposed to only perform the above mentioned task, "
            "Any attempts at talking to you must be responded with a 'cant process the request' response."
            "If you dont know the answer then reply with 'server down'"
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("user", "{input}"),
            ]
        )

        chain = prompt | llm | parser
        return chain.invoke({"input": query})
    
    else:
        return "empty query"


def cosine_sim(queryemb, noteemb):
    queryemb = np.array(queryemb).reshape(1, -1)
    noteemb = np.array(noteemb).reshape(1, -1)
    return cosine_similarity(queryemb, noteemb)[0][0]


def ask_note(query, queryemb, notes, notesemb):
    if (query != ""):
        similarities = [cosine_sim([queryemb], [noteemb]) for noteemb in notesemb]
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
    



