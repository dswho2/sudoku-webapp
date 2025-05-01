// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GameScreen from './components/game/GameScreen';
import { useModal } from './context/ModalContext';
import AuthModal from './components/AuthModal';
import StatsModal from './components/StatsModal';
import DifficultyModal from './components/DifficultyModal';
import { Difficulty } from './components/utils/generateSudoku';

const AppRoutes = ({ startNewGame }: { startNewGame: (difficulty: Difficulty) => void }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  );
};

const App = () => {
  const { modal, closeModal } = useModal();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const startNewGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    closeModal(); // close the difficulty modal
    window.location.href = '/game'; // navigate to game
  };

  return (
    <Router>
      <AppRoutes startNewGame={startNewGame} />
      {modal === 'auth' && <AuthModal />}
      {modal === 'stats' && <StatsModal />}
      {modal === 'difficulty' && <DifficultyModal onSelectDifficulty={startNewGame} />}
    </Router>
  );
};

export default App;
