// src/components/game/VictoryScreen.tsx

import React from 'react';

interface VictoryScreenProps {
  onNewGame: () => void;
  time: string;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onNewGame, time }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl text-center shadow-2xl transform scale-100 animate-in fade-in duration-300 max-w-md w-full mx-4">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-700">
            You've won!
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-600 mb-1">Completion Time</p>
          <p className="text-3xl font-semibold text-gray-800">{time}</p>
        </div>

        <button
          onClick={onNewGame}
          className="bg-green-700 text-white py-3 px-8 rounded-lg text-lg font-semibold
                   hover:bg-green-500 transform hover:scale-105 transition-all duration-200
                   shadow-md hover:shadow-lg w-full max-w-xs mx-auto"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;