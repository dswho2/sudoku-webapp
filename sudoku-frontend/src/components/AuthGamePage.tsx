// src/AuthGamePage.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import GameScreen from './game/GameScreen';
import AuthPage from './AuthModal';

const AuthGamePage = () => {
  const location = useLocation();
  const showAuth = new URLSearchParams(location.search).get('auth') === '1';

  return (
    <>
      <GameScreen />
      {showAuth && <AuthPage />}
    </>
  );
};

export default AuthGamePage;