import pandas as pd
import os

def fetch_data():
    data_path = os.getenv("DATA_PATH")

    if not os.path.exists(data_path):
        return {"error": "Data file not found"}

    df = pd.read_csv(data_path)
    return df.head().to_dict(orient="records")
