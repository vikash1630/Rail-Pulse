import pandas as pd
import os

def fetch_all_trains():

    trains_path = os.getenv("DATA_PATH_TRAINS", "data/trains.csv")

    if not os.path.exists(trains_path):
        return None

    df = pd.read_csv(trains_path, low_memory=False)

    return df