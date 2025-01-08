// SudokuCell.tsx
import React from 'react';

interface SudokuCellProps {
  highlighted: boolean;
  selected: boolean;
  onClick: () => void;
  editable: boolean;
  value?: number;
  isConflicted?: boolean;
}

const SudokuCell = ({ highlighted, selected, onClick, editable, value, isConflicted }: SudokuCellProps) => {
  return (
    <div 
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center text-lg font-medium transition-all duration-150 cursor-pointer
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
        fontSize: '1.5rem',
        textAlign: 'center'
      }}
    >
      <span className="text-center text-xl font-medium">
        {value || ''}
      </span>
    </div>
  );
};

export default SudokuCell;