import pandas as pd
import numpy as np

def get_trains_data():
    df = pd.read_csv('data/trains.csv')

    # Replace NaN with None (important)
    df = df.replace({np.nan: None})

    return df.head().to_dict(orient='records')