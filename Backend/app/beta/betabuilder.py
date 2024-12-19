import logging
from fastapi import APIRouter
from pydantic import BaseModel
from pymongo import MongoClient
from app.constants import MONGO_URI, ADMIN_TOKEN

logging.getLogger("pymongo").propagate = False

betasetup = APIRouter()

client = MongoClient(MONGO_URI)
db = client["beta"]
collection = db["users"]

class buildUser(BaseModel):
    name: str
    email: str
    phone: int

class userFeedback(BaseModel):
    feedback: str

# to be accessed only by admin panel
@betasetup.post("/beta/create/user/{admin_token}", tags=["beta"])
async def build_beta_users_db(admin_token: str, user: buildUser):
    if admin_token != ADMIN_TOKEN:
        return "admin token invalid!"
    user_dict = user.dict()  
    try:
        collection.insert_one(user_dict)  
        return "User successfully added to beta-users collection."
    except Exception as e:
        return f"An error occurred: {str(e)}"
    
@betasetup.get("/beta/users", tags=["beta"])
async def get_beta_users_name():
    try:
        users = collection.find({}, {"_id": 0, "name": 1})  # include name, exclude _id        
        user_names = [user["name"] for user in users]
        return user_names
    except Exception as e:
        return {"error": str(e)}
    
@betasetup.post("/beta/feedback/{user_name}", tags=["beta"])
async def send_feedback(user_name: str, user_feedback: userFeedback):
    try:
        user = collection.find_one({"name": user_name})
        if user:
            collection.update_one(
                {"name": user_name},
                {"$push": {"feedback": user_feedback.feedback}}  
            )
            return {"message": "Feedback successfully added for the user."}
        else:
            return {"error": "User not found."}

    except Exception as e:
        return {"error": str(e)}