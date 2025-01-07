// components/game/GameScreen.tsx
import React, { useState } from 'react';
import { Menu as MenuIcon, Undo2, Eraser, PenLine, Lightbulb } from 'lucide-react';
import GameBoard from './GameBoard';
import NumberButton from './NumberButton';
import ActionButton from './ActionButton';
import Menu from './Menu';
import useTimer from '../../hooks/useTimer';

const generateNewPuzzle = () => {
  return [
    [5, 3, undefined, undefined, 7, undefined, undefined, undefined, undefined],
    [6, undefined, undefined, 1, 9, 5, undefined, undefined, undefined],
    [undefined, 9, 8, undefined, undefined, undefined, undefined, 6, undefined],
    [8, undefined, undefined, undefined, 6, undefined, undefined, undefined, 3],
    [4, undefined, undefined, 8, undefined, 3, undefined, undefined, 1],
    [7, undefined, undefined, undefined, 2, undefined, undefined, undefined, 6],
    [undefined, 6, undefined, undefined, undefined, undefined, 2, 8, undefined],
    [undefined, undefined, undefined, 4, 1, 9, undefined, undefined, 5],
    [undefined, undefined, undefined, undefined, 8, undefined, undefined, 7, 9],
  ];
}

const GameScreen = () => {
  const [initialPuzzle, setInitialPuzzle] = useState(generateNewPuzzle());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { time, resetTimer } = useTimer(true);

  const handleNewGame = () => {
    const newPuzzle = generateNewPuzzle();
    setInitialPuzzle(newPuzzle);
    resetTimer(); // Reset the timer for the new game
  };

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
          initialPuzzle={initialPuzzle}
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
