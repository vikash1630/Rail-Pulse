from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
    set_access_cookies
)
from bson.objectid import ObjectId
from src.user_model import users_collection

bcrypt = Bcrypt()


# ── SIGNUP ─────────────────────────────────────────────
def signup():
    data = request.get_json()

    if not data:
        return {"error": "No data received"}, 400

    if users_collection.find_one({"email": data["email"]}):
        return {"error": "User already exists"}, 400

    hashed_password = bcrypt.generate_password_hash(
        data["password"]
    ).decode("utf-8")

    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password
    }

    users_collection.insert_one(user)

    return {"message": "User registered successfully"}, 201


# ── LOGIN ─────────────────────────────────────────────
def login():
    data = request.get_json()

    if not data:
        return {"error": "No data received"}, 400

    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return {"error": "Invalid credentials"}, 401

    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return {"error": "Invalid credentials"}, 401

    access_token = create_access_token(identity=str(user["_id"]))

    response = jsonify({"message": "Login successful"})
    set_access_cookies(response, access_token)  # ✅ correct way

    return response, 200


# ── GET CURRENT USER ───────────────────────────────────
@jwt_required(locations=["cookies"])
def me():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"error": "User not found"}, 404

    return jsonify({
        "name": user["name"],
        "email": user["email"]
    }), 200


# ── LOGOUT ─────────────────────────────────────────────
def logout():
    response = jsonify({"message": "Logged out"})
    unset_jwt_cookies(response)  # removes access_token_cookie
    return response, 200