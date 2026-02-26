# user_model.py

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv() 

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]


#All Users
users_collection = db["users"]  


