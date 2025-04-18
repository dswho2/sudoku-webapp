// src/components/game/GameScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Menu as MenuIcon, Undo2, Eraser, PenLine, Lightbulb } from 'lucide-react';
import { X } from 'lucide-react';
import GameBoard from './GameBoard';
import NumberButton from './NumberButton';
import ActionButton from './ActionButton';
import VictoryScreen from './VictoryScreen';
import Menu from './Menu';
import useTimer from '../../hooks/useTimer';
import { generateSudoku } from '../utils/generateSudoku';
import {updateNotesAfterMove, autofillNotes} from '../utils/generateNotes'

import { useModal } from '../../context/ModalContext';

const generateNewPuzzle = (clues: number = 20) => {
  // testing victory screen
  // const puzzle = [
  //   [1,2,3,4,undefined,6,7,8,9],
  //   [4,5,6,7,8,9,1,2,3],
  //   [7,8,9,1,2,3,4,5,6],
  //   [2,1,4,3,6,5,8,9,7],
  //   [3,6,5,8,9,7,2,1,4],
  //   [8,9,7,2,1,4,3,6,5],
  //   [5,3,1,6,4,2,9,7,8],
  //   [6,4,2,9,7,8,5,3,1],
  //   [9,7,8,5,3,1,6,4,2],
  // ];
  // const solution =  [
  //   [1,2,3,4,5,6,7,8,9],
  //   [4,5,6,7,8,9,1,2,3],
  //   [7,8,9,1,2,3,4,5,6],
  //   [2,1,4,3,6,5,8,9,7],
  //   [3,6,5,8,9,7,2,1,4],
  //   [8,9,7,2,1,4,3,6,5],
  //   [5,3,1,6,4,2,9,7,8],
  //   [6,4,2,9,7,8,5,3,1],
  //   [9,7,8,5,3,1,6,4,2],
  // ];
  

  const { puzzle, solution } = generateSudoku(clues);
  return { puzzle, solution };
};

const GameScreen = () => {
  const [initialPuzzle, setInitialPuzzle] = useState<(number | undefined)[][] | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<(number | undefined)[][] | null>(null);
  const [solution, setSolution] = useState<(number | undefined)[][] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const { modal } = useModal();
  const { time, resetTimer, stopTimer, setIsRunning } = useTimer(true);

  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState<number[][][]>(
    Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => [])
    )
  );

  useEffect(() => {
    setIsRunning(!isMenuOpen && modal !== 'auth');
  }, [isMenuOpen, modal, setIsRunning]);

  useEffect(() => {
    const { puzzle, solution } = generateNewPuzzle(20);
    setInitialPuzzle(puzzle);
    setCurrentPuzzle(puzzle.map(row => [...row]));
    setSolution(solution);
  }, []);

  const handleNewGame = useCallback(() => {
    const { puzzle, solution } = generateNewPuzzle(20);
    setInitialPuzzle(puzzle);
    setCurrentPuzzle(puzzle.map(row => [...row]));
    setSolution(solution);
    setSelectedNumber(null);
    setSelectedAction(null);
    setIsSolved(false);
    resetTimer();
  }, [resetTimer]);

  const handleAutofillNotes = () => {
    if (!currentPuzzle) return;
    setNotes(autofillNotes(currentPuzzle));
  };

  // const isPuzzleSolved = useMemo(() => {
  //   if (!currentPuzzle || !solution) return false;
    
  //   return currentPuzzle.every((row, rowIndex) =>
  //     row.every((cell, colIndex) => 
  //       cell !== undefined && cell === solution[rowIndex][colIndex]
  //     )
  //   );
  // }, [currentPuzzle, solution]);

  const updateNotes = (rowIndex: number, colIndex: number, number: number) => {
    const updatedNotes = notes.map(row => row.map(cell => [...cell]));
    const cellNotes = updatedNotes[rowIndex][colIndex];
    
    if (cellNotes.includes(number)) {
      updatedNotes[rowIndex][colIndex] = cellNotes.filter(n => n !== number);
    } else {
      updatedNotes[rowIndex][colIndex] = [...cellNotes, number].sort((a, b) => a - b);
    }
    
    setNotes(updatedNotes);
  };

  const updateBoard = (rowIndex: number, colIndex: number, number: number) => {
    if (!currentPuzzle || !initialPuzzle) return;

    const updatedPuzzle = currentPuzzle.map(row => [...row]);
    if (updatedPuzzle[rowIndex][colIndex] === number) {
      updatedPuzzle[rowIndex][colIndex] = undefined;
    } else {
      updatedPuzzle[rowIndex][colIndex] = number;
      if (number !== undefined) {
        const updatedNotes = updateNotesAfterMove(notes, updatedPuzzle, rowIndex, colIndex, number);
        updatedNotes[rowIndex][colIndex] = [];
        setNotes(updatedNotes);
      }
    }
    setCurrentPuzzle(updatedPuzzle);

    const isBoardFull = updatedPuzzle.every(row => 
      row.every(cell => cell !== undefined)
    );

    if (isBoardFull) {
      const isCorrect = updatedPuzzle.every((row, rowIndex) =>
        row.every((cell, colIndex) => 
          cell === solution?.[rowIndex][colIndex]
        )
      );
      if (isCorrect) {
        stopTimer();
      }
      setIsSolved(isCorrect);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex justify-between items-center py-4">
        <h1 className="text-3xl font-semibold">Sudoku</h1>
        <div className="flex items-center gap-2 relative">
          <span className="text-xl">{time}</span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={`w-6 h-6 inline-block transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isMenuOpen ? <X /> : <MenuIcon />}
            </span>
          </button>
        </div>
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        {!isSolved && initialPuzzle && currentPuzzle && (
          <GameBoard
            key={initialPuzzle.toString()}
            initialPuzzle={initialPuzzle}
            currentPuzzle={currentPuzzle}
            selectedNumber={selectedNumber}
            setSelectedNumber={setSelectedNumber}
            updateBoard={updateBoard}
            isNotesMode={isNotesMode}
            notes={notes}
            updateNotes={updateNotes}
          />
        )}
      </div>

      <div className="w-full max-w-md mt-6 flex flex-col gap-4">
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
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
            selected={isNotesMode}
            onClick={() => setIsNotesMode(!isNotesMode)}
          />
          <ActionButton
            icon={Lightbulb}
            selected={selectedAction === 'hint'}
            onClick={() => setSelectedAction(selectedAction === 'hint' ? null : 'hint')}
          />
        </div>
      </div>

      {isSolved && <VictoryScreen onNewGame={handleNewGame} time={time} />}

      <Menu
        isOpen={isMenuOpen}
        onNewGame={handleNewGame}
        onAutofillNotes={handleAutofillNotes}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default GameScreen;