// components/HomePage.tsx
import React from 'react';
import { useModal } from '../context/ModalContext';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage = ({ onStartGame }: HomePageProps) => {
  const { openModal } = useModal();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
      <h1 className="text-4xl font-semibold mb-16">Sudoku</h1>
      <div className="flex flex-col space-y-4 w-32">
        <button 
          onClick={onStartGame}
          className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600"
        >
          New Game
        </button>
        <button 
          className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600"
        >
          Stats
        </button>
        <button 
          onClick={() => openModal('auth')}
          className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;
