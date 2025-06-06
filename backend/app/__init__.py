# backend/app/__init__.py

from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import openai
import os
from datetime import datetime
from zoneinfo import ZoneInfo

from .config import Config
from .models import db, bcrypt, User

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://sudoku-webapp.vercel.app"
]}}, supports_credentials=True, automatic_options=True)

jwt = JWTManager()

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Blueprint for all routes
api = Blueprint('api', __name__)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# for vercel sqlite (non persistent db)
def ensure_db_initialized():
    if not hasattr(app, "_db_initialized"):
        with app.app_context():
            db.create_all()
        app._db_initialized = True

@api.route('/register', methods=['POST'])
def register():
    ensure_db_initialized()
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already taken"}), 400

    created_at = datetime.now(ZoneInfo("America/Los_Angeles"))

    user = User(username=username, created_at=created_at)
    user.set_password(password)
    user.games_played = 0
    user.total_time = 0
    user.fastest_time = None
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    ensure_db_initialized()
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "id": user.id}), 200

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    ensure_db_initialized()
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)
    return jsonify({"msg": f"Hello {user.username}", "id": user.id}), 200

@api.route('/update_stats', methods=['POST'])
@jwt_required()
def update_stats():
    ensure_db_initialized()
    data = request.get_json()
    new_time = data.get('time_seconds')

    if new_time is None or not isinstance(new_time, int) or new_time < 0:
        return jsonify({"msg": "Invalid or missing time_seconds"}), 400

    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({"msg": "User not found"}), 404

    user.games_played = (user.games_played or 0) + 1
    user.total_time = (user.total_time or 0) + new_time

    if user.fastest_time is None or new_time < user.fastest_time:
        user.fastest_time = new_time

    db.session.commit()

    return jsonify({
        "msg": "Stats updated",
        "games_played": user.games_played,
        "total_time": user.total_time,
        "fastest_time": user.fastest_time
    }), 200

@api.route('/get_stats', methods=['GET'])
@jwt_required()
def get_stats():
    ensure_db_initialized()
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)

    if user is None:
        return jsonify({"msg": "User not found"}), 404

    avg_time = user.total_time // user.games_played if user.games_played else None

    return jsonify({
        "username": user.username,
        "games_played": user.games_played,
        "fastest_time": user.fastest_time,
        "average_time": avg_time
    }), 200

@api.route('/hint', methods=['POST'])
@jwt_required(optional=True)
def get_hint():
    # checks for admin login to preserve gpt token usage
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({"error": "Only admin login can request hints"}), 403
    
    user = db.session.get(User, user_id)
    if not user or user.username != "admin":
        return jsonify({"error": "Only admin login can request hints"}), 403
    


    data = request.get_json()
    board = data.get("board")
    if not board:
        return jsonify({"error": "Missing board"}), 400

    flat_board = "\n".join(
        " ".join(str(cell) if cell is not None else "." for cell in row)
        for row in board
    )

    prompt = (
        "This is a Sudoku board with empty cells marked as dots.\n"
        "Give a hint for a possible move without giving away the full solution.\n"
        f"\n{flat_board}\n"
        "Hint:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You're a Sudoku assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        hint = response.choices[0].message.content.strip()
        return jsonify({"hint": hint})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def index():
    return "Sudoku Backend API is running."

# Register blueprint with prefix
app.register_blueprint(api)

# Local-only DB setup
def init_app():
    os.makedirs('instance', exist_ok=True)
    print("DB:", app.config['SQLALCHEMY_DATABASE_URI'])
    with app.app_context():
        db.create_all()
