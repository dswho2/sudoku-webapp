// src/components/DifficultyModal.tsx
import React from 'react';
import { useModal } from '../context/ModalContext';
import { Difficulty } from './utils/generateSudoku';
import { X } from 'lucide-react';

interface Props {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyModal: React.FC<Props> = ({ onSelectDifficulty }) => {
  const { closing, closeModal } = useModal();

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="relative bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-80">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Choose Difficulty</h2>

        <div className="flex flex-col gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => {
                onSelectDifficulty(level);
                closeModal();
              }}
              className="py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              {level[0].toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultyModal;
