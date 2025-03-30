from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
from database import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    # ✅ Check if user already exists before inserting
    cur.execute("SELECT email FROM users WHERE email = %s", (email,))
    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        conn.close()
        return jsonify({"msg": "User already exists"}), 400

    # 🔐 Hash the password and insert new user
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password.decode('utf-8')))
        conn.commit()
        return jsonify({"msg": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"msg": "Database error", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email, password = data["email"], data["password"].encode('utf-8')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT password FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and bcrypt.checkpw(password, user[0].encode('utf-8')):
        user_id = user[0]
        access_token = create_access_token(identity=email)
        return jsonify({"access_token": access_token , "user_id": user_id}), 200

    return jsonify({"msg": "Invalid credentials"}), 401
