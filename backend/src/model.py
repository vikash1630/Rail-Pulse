# model.py
import pandas as pd
import os
from pymongo import MongoClient

from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]
trains_collection = db["trains"]



def seed_trains_to_database():
    # Get file paths from environment variables
    trains_path = os.getenv("DATA_PATH_TRAINS", "data/trains.csv")
    cities_path = os.getenv("DATA_PATH_CITIES", "data/cities.csv")

    # Check if files exist
    if not os.path.exists(trains_path):
        return None
    if not os.path.exists(cities_path):
        return None

    # READ the CSVs into DataFrames first
    df = pd.read_csv(trains_path)
    cities = pd.read_csv(cities_path)

    # Now merge (DataFrame.merge works, string.merge doesn't)
    df = df.merge(cities[['City','Lat','Lng']], left_on='StartingPoint', right_on='City') \
           .rename(columns={'Lat':'from_lat','Lng':'from_lng'}) \
           .drop('City', axis=1)

    df = df.merge(cities[['City','Lat','Lng']], left_on='FinalDestination', right_on='City') \
           .rename(columns={'Lat':'to_lat','Lng':'to_lng'}) \
           .drop('City', axis=1)

    # Clear old data (optional)
    trains_collection.delete_many({})

    trains_collection.insert_many(df.to_dict("records"))

    return "Data Base Seeded Successfully"


# 🔹 Fetch All Trains (From Mongo Now)  *** currently use this for understanding pandas data frame while practising
def fetch_all_trains():
    # Get file paths from environment variables
    trains_path = os.getenv("DATA_PATH_TRAINS", "data/trains.csv")
    cities_path = os.getenv("DATA_PATH_CITIES", "data/cities.csv")

    # Check if files exist
    if not os.path.exists(trains_path):
        return None
    if not os.path.exists(cities_path):
        return None

    # READ the CSVs into DataFrames first
    df = pd.read_csv(trains_path)
    cities = pd.read_csv(cities_path)

    # Now merge (DataFrame.merge works, string.merge doesn't)
    df = df.merge(cities[['City','Lat','Lng']], left_on='StartingPoint', right_on='City') \
           .rename(columns={'Lat':'from_lat','Lng':'from_lng'}) \
           .drop('City', axis=1)

    df = df.merge(cities[['City','Lat','Lng']], left_on='FinalDestination', right_on='City') \
           .rename(columns={'Lat':'to_lat','Lng':'to_lng'}) \
           .drop('City', axis=1)
    
    return df