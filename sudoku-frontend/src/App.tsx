// App.tsx
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import GameScreen from './components/game/GameScreen';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div>
      {gameStarted ? (
        <GameScreen />
      ) : (
        <HomePage onStartGame={() => setGameStarted(true)} />
      )}
    </div>
  );
};

export default App;