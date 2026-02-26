from src.user_controller import signup, login, me, logout


def register_auth_routes(app):

    @app.route("/api/auth/signup", methods=["POST"])
    def signup_user():
        return signup()


    @app.route("/api/auth/login", methods=["POST"])
    def login_user():
        return login()


    @app.route("/api/auth/me", methods=["GET"])
    def get_current_user():
        return me()


    @app.route("/api/auth/logout", methods=["POST"])
    def logout_user():
        return logout()