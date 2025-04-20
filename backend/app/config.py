# backend/app/config.py

import os

from dotenv import load_dotenv
load_dotenv()

database_url = os.getenv("DATABASE_URL", "")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

class Config:
    # in vercel backend env var settings for prod
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret")