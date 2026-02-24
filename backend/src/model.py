# model.py
# This file handles reading data from the CSV file

import pandas as pd
import os


def fetch_all_trains():
    """
    Reads the CSV file and returns dataframe.
    """

    # Get file path from environment variable
    data_path = os.getenv("DATA_PATH", "data/trains.csv")

    # Check if file exists
    if not os.path.exists(data_path):
        return None

    # Read CSV file
    df = pd.read_csv(data_path)

    return df