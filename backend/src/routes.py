from src.controller import get_train_data

def register_routes(app):

    @app.route("/")
    def home():
        return {"message": "RailPulse Backend Running"}

    @app.route("/api/data")
    def data():
        return get_train_data()
