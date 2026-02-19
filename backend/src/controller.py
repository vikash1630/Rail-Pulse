from flask import jsonify
from src.model import fetch_data

def get_train_data():
    data = fetch_data()
    return jsonify(data)
