// NotesCell.tsx
import React from 'react';

interface NotesCellProps {
  notes: number[];
}

const NotesCell = ({ notes }: NotesCellProps) => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <div key={number} className="flex items-center justify-center h-4">
          <span className="text-[10px] text-gray-600">
            {notes.includes(number) ? number : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default NotesCell;