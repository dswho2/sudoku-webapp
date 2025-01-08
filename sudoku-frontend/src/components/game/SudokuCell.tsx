// SudokuCell.tsx
import React from 'react';
import NotesCell from './NotesCell';

interface SudokuCellProps {
  highlighted: boolean;
  selected: boolean;
  onClick: () => void;
  editable: boolean;
  value?: number;
  notes: number[];
  isConflicted?: boolean;
}

const SudokuCell = ({ 
  highlighted, 
  selected, 
  onClick, 
  editable, 
  value, 
  notes,
  isConflicted 
}: SudokuCellProps) => {
  return (
    <div 
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center transition-all duration-150 cursor-pointer aspect-square
        ${highlighted ? 'bg-blue-50' : 'bg-white'}
        ${selected ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : ''}
        ${isConflicted ? 'text-red-500 bg-red-50' : value ? editable ? 'text-blue-700' : 'text-gray-700' : ''}
        hover:bg-blue-50
      `}
      style={{ 
        height: '100%', 
        width: '100%', 
        minHeight: '40px',
        minWidth: '40px',
        maxHeight: '60px',
        maxWidth: '60px',
      }}
    >
      {value ? (
        <span className="text-center text-xl font-medium">
          {value}
        </span>
      ) : notes.length > 0 ? (
        <NotesCell notes={notes} />
      ) : null}
    </div>
  );
};

export default SudokuCell;