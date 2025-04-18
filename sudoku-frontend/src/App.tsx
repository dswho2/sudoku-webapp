// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GameScreen from './components/game/GameScreen';
import { useModal } from './context/ModalContext';
import AuthPage from './components/AuthModal';

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<HomePage onStartGame={() => navigate('/game')} />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  );
};

const App = () => {
  const { modal } = useModal();

  return (
    <Router>
      <AppRoutes />
      {modal === 'auth' && <AuthPage />}
    </Router>
  );
};

export default App;