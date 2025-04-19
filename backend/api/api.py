# backend/api/api.py

from app import app

def handler(request):
    return app(request)