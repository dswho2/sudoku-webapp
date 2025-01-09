// NotesCell.tsx
import React from 'react';

interface NotesCellProps {
  notes: number[];
  highlightedNumber: number | null;
}

const NotesCell = ({ notes, highlightedNumber }: NotesCellProps) => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
        const isHighlighted = highlightedNumber === number && notes.includes(number);
        return (
          <div key={number} className="flex items-center justify-center">
            <div className={`flex items-center justify-center ${isHighlighted ? 'w-3 h-3 rounded-full bg-blue-100' : ''}`}>
              <span className={`text-[10px] ${isHighlighted ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                {notes.includes(number) ? number : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotesCell;