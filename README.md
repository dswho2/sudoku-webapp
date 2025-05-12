# Sudoku Webapp

Webapp to play sudoku.
<https://sudoku-webapp.vercel.app/>

Created with React and Typescript with Tailwind CSS for the frontend. Flask and PostgreSQL for the backend. user authentication, storing data such as scores and puzzles solved. Vercel for hosting the frontend.

## Features
- Fully playable Sudoku board with input validation and notes and timer
- Autofill notes and undo functionality
- Stats tracking for logged-in users (games played, fastest time, average time)
- AI powered hint suggestions utilizing OpenAI's GPT API
- Persistent user accounts with JWT-based authentication
- Victory screen with timing statistics
- Game difficulty selection

## Running Locally
### Frontend
```
cd sudoku-frontend
npm start
```
### Backend
```
cd sudoku-backend
python app/__init__.py
```

## Environment Variables
### Frontend
```
REACT_APP_BACKEND_URL=http://localhost:5000
```
### Backend
```
OPENAI_API_KEY=...
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=...
```