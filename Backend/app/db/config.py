from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(f"mongodb+srv://sidharthh1880:{os.getenv("PASSWORD")}@sid.jecjz.mongodb.net/?retryWrites=true&w=majority&appName=sid")

db = client.braindump
collection_name = db["user"]
