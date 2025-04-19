# sudoku-backend/run.py

from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.local")

from app import app, init_app

if __name__ == "__main__":
    init_app()
    app.run(debug=True)