# api/api.py

from app import app

import sys
sys.dont_write_bytecode = True

def handler(request):
    return app(request)