import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

def generate_embedding(query):
    if (query != ""):
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("API_KEY"))
        vector = embeddings.embed_query(query)
        return vector
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


