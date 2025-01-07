// components/game/Menu.tsx
import React, { useState } from 'react';

interface MenuProps {
  isOpen: boolean;
  onNewGame: () => void;
}

const Menu = ({ isOpen, onNewGame }: MenuProps) => {
  const [isLightMode, setIsLightMode] = useState(false);

  const handleToggleLightMode = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('Light', !isLightMode); // Toggle Light mode on <html>
  };

  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 top-12 z-50 ${isLightMode ? 'bg-white' : 'bg-dark-blue'} shadow-lg border ${isLightMode ? 'border-gray-100' : 'border-gray-700'}`}>
      <div className="flex flex-col">
        <button 
          onClick={onNewGame}
          className={`px-4 py-2 text-left hover:${isLightMode ? 'bg-gray-100' : 'bg-gray-700'} ${isLightMode ? 'text-black' : 'text-white'}`}
        >
          New Game
        </button>
        <button className={`px-4 py-2 text-left hover:${isLightMode ? 'bg-gray-100' : 'bg-gray-700'} ${isLightMode ? 'text-black' : 'text-white'}`}>
          Stats
        </button>
        <button className={`px-4 py-2 text-left hover:${isLightMode ? 'bg-gray-100' : 'bg-gray-700'} ${isLightMode ? 'text-black' : 'text-white'}`}>
          Log In
        </button>
        <button 
          onClick={handleToggleLightMode}
          className={`px-4 py-2 text-left hover:${isLightMode ? 'bg-gray-100' : 'bg-gray-700'} ${isLightMode ? 'text-black' : 'text-white'}`}
        >
          {isLightMode ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export default Menu;