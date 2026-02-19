from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register routes
from src.routes import register_routes
register_routes(app)

if __name__ == "__main__":
    app.run(
        debug=os.getenv("DEBUG") == "True",
        port=int(os.getenv("PORT", 5000))
    )
