# model.py
import pandas as pd
import os

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