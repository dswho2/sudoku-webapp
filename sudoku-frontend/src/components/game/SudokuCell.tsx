// SudokuCell.tsx
import React from 'react';
import NotesCell from './NotesCell';

interface SudokuCellProps {
  value: number | undefined;
  editable: boolean;
  highlighted: boolean;
  selected: boolean;
  isConflicted: boolean;
  onClick: () => void;
  notes: number[];
  highlightedNumber: number | null;
}

const SudokuCell = ({
  value,
  editable,
  highlighted,
  selected,
  isConflicted,
  onClick,
  notes,
  highlightedNumber,
}: SudokuCellProps) => {
  return (
    <div
      className={`
        w-full h-full
        flex items-center justify-center
        cursor-pointer aspect-square
        ${highlighted ? 'bg-blue-50' : 'bg-white'}
        ${selected ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : ''}
        ${isConflicted ? 'text-red-500' : editable ? 'text-blue-600' : 'text-gray-900'}
      `}
      onClick={onClick}
    >
      {value ? (
        <span className={`text-lg font-medium ${value === highlightedNumber ? 'text-blue-600' : ''}`}>
          {value}
        </span>
      ) : (
        <NotesCell notes={notes} highlightedNumber={highlightedNumber} />
      )}
    </div>
  );
};

export default SudokuCell;