from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(api_key=OPENAI_API_KEY)

llm.invoke("how can langsmith help with testing?")