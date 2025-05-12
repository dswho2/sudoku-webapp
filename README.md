# Sudoku Web App with AI Hints

Webapp to play sudoku.
<https://sudoku-webapp.vercel.app/>

Created with React and TypeScript using Tailwind CSS for the frontend, and Flask with PostgreSQL for the backend. This project features user authentication, persistent tracking of stats such as scores and puzzles solved, and integrates the OpenAI GPT API for intelligent hint generation. The frontend is deployed on Vercel, while the backend runs on Vercel Functions with a Neon-hosted PostgreSQL database.

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