// components/game/GameScreen.tsx
import React, { useState } from 'react';
import { Menu as MenuIcon, Undo2, Eraser, PenLine, Lightbulb } from 'lucide-react';
import GameBoard from './GameBoard';
import NumberButton from './NumberButton';
import ActionButton from './ActionButton';
import Menu from './Menu';
import useTimer from '../../hooks/useTimer';

const GameScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { time } = useTimer(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex justify-between items-center py-4">
        <h1 className="text-3xl font-semibold">Sudoku</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl">{time}</span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon size={24} />
          </button>
          <Menu isOpen={isMenuOpen} onNewGame={() => {}} />
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <GameBoard
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />

        <div className="w-full mt-6 flex flex-col gap-4">
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <NumberButton
                key={num}
                number={num}
                selected={selectedNumber === num}
                onClick={() => setSelectedNumber(selectedNumber === num ? null : num)}
              />
            ))}
          </div>

          <div className="flex gap-1 justify-center">
            <ActionButton 
              icon={Undo2} 
              selected={selectedAction === 'undo'}
              onClick={() => setSelectedAction(selectedAction === 'undo' ? null : 'undo')} 
            />
            <ActionButton 
              icon={Eraser} 
              selected={selectedAction === 'erase'}
              onClick={() => setSelectedAction(selectedAction === 'erase' ? null : 'erase')} 
            />
            <ActionButton 
              icon={PenLine} 
              selected={selectedAction === 'notes'}
              onClick={() => setSelectedAction(selectedAction === 'notes' ? null : 'notes')} 
            />
            <ActionButton 
              icon={Lightbulb} 
              selected={selectedAction === 'hint'}
              onClick={() => setSelectedAction(selectedAction === 'hint' ? null : 'hint')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
