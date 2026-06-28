from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from api.db import get_db

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = "chainsight-super-secret-key"

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")
    
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
    conn.close()
    
    if user:
        token = jwt.encode({
            "user_id": user["id"],
            "username": user["username"],
            "role": user["role"],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({
            "token": token,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"]
            }
        })
    return jsonify({"error": "Invalid credentials"}), 401
