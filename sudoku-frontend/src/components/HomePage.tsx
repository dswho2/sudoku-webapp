// components/HomePage.tsx
import React from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import useUsername from '../hooks/useUsername';

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage = ({ onStartGame }: HomePageProps) => {
  const { openModal } = useModal();
  const { token, logout } = useAuth();
  const username = useUsername();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
      <h1 className="text-4xl font-semibold mb-4">Sudoku</h1>
      <p className="mb-10 text-lg">Hello, <span className="font-semibold">{username}</span></p>

      <div className="flex flex-col space-y-4 w-32">
        <button onClick={onStartGame} className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600">
          New Game
        </button>
        <button
          onClick={() => openModal('stats')}
          className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600"
        >
          Stats
        </button>
        {token ? (
          <button
            onClick={logout}
            className="w-full py-2 text-center bg-red-600 border border-black hover:bg-red-500"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => openModal('auth')}
            className="w-full py-2 text-center bg-blue-600 border border-black hover:bg-gray-600"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
