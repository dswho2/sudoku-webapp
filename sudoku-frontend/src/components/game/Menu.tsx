// src/components/game/Menu.tsx
import React from 'react';
import { X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';

import { useAuth } from '../../context/AuthContext';
import useUsername from '../../hooks/useUsername';

interface MenuProps {
  isOpen: boolean;
  onNewGame: () => void;
  onAutofillNotes: () => void;
  onClose: () => void;
}

const Menu = ({ isOpen, onNewGame, onAutofillNotes, onClose }: MenuProps) => {
  const navigate = useNavigate();

  const { openModal } = useModal();

  const { token, logout } = useAuth();

  const username = useUsername();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-zinc-900 text-white shadow-lg p-6 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="text-lg mb-6">Hello, <span className="font-semibold">{username}</span></div>
        <button
          className="absolute top-4 right-4 text-white hover:text-red-400"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="flex flex-col gap-4 mt-12">
          <button
            onClick={() => {
              onNewGame();
              onClose();
            }}
            className="text-left w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            New Game
          </button>
          <button
            className="text-left w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Stats
          </button>
          <button
            onClick={() => {
              onAutofillNotes();
              onClose();
            }}
            className="text-left w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Autofill Notes
          </button>
          <button
            onClick={() => {
              navigate('/');
              onClose();
            }}
            className="text-left w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
          >
            Home
          </button>
          {token ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-left w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                openModal('auth');
                onClose();
              }}
              className="text-left w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
