// components/HomePage.tsx
import React from 'react';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage = ({ onStartGame }: HomePageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
      <h1 className="text-4xl font-semibold mb-16">Sudoku</h1>
      <div className="flex flex-col space-y-4 w-32">
        <button 
          onClick={onStartGame}
          className="w-full py-2 text-center bg-dark-blue border border-black hover:bg-gray-600"
        >
          New Game
        </button>
        <button 
          className="w-full py-2 text-center bg-dark-blue border border-black hover:bg-gray-600"
        >
          Stats
        </button>
        <button 
          className="w-full py-2 text-center bg-dark-blue border border-black hover:bg-gray-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;
