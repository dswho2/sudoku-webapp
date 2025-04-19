# backend/app/__init__.py

from flask import Flask, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os
from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://sudoku-webapp.vercel.app"
]}}, supports_credentials=True, automatic_options=True)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Blueprint for all routes
api = Blueprint('api', __name__)

# for vercel sqlite (non persistent db)
def ensure_db_initialized():
    if not hasattr(app, "_db_initialized"):
        with app.app_context():
            db.create_all()
        app._db_initialized = True

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

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

    user = User(username=username)
    user.set_password(password)
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

