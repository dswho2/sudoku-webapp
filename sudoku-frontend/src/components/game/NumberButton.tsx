// components/game/NumberButton.tsx
import React from 'react';

interface NumberButtonProps {
  number: number;
  selected: boolean;
  onClick: (number: number) => void;
}

const NumberButton = ({ number, selected, onClick }: NumberButtonProps) => {
  return (
    <button
      onClick={() => onClick(number)}
      className={`
        w-10 h-10 text-lg flex items-center justify-center
        ${selected ? 'border border-black bg-gray-700' : ''}
        hover:bg-gray-700
      `}
    >
      {number}
    </button>
  );
};

export default NumberButton;