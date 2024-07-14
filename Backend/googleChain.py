from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

def llmOutput(input):
  output_parser = StrOutputParser()
  llm = GoogleGenerativeAI(model='gemini-pro')
  prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a text parser, you convert transcript of spoken words and commands to proper text in markdown"),
      ("user", "{input}")
  ])
  
  chain = prompt | llm | output_parser
  return chain.invoke({"input":input})


