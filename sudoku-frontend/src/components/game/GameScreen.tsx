// src/components/game/GameScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Menu as MenuIcon, Undo2, Eraser, PenLine, Lightbulb, X, Loader2 } from 'lucide-react';
import GameBoard from './GameBoard';
import NumberButton from './NumberButton';
import ActionButton from './ActionButton';
import VictoryScreen from './VictoryScreen';
import Menu from './Menu';
import DifficultyModal from '../DifficultyModal';
import useTimer from '../../hooks/useTimer';
import { generateSudoku, Difficulty } from '../utils/generateSudoku';
import { updateNotesAfterMove, autofillNotes } from '../utils/generateNotes';
import { useModal } from '../../context/ModalContext';
import { getHint } from '../../api/hint';
import { useAuth } from '../../context/AuthContext';

const generateNewPuzzle = (difficulty: Difficulty = 'medium') => {
  const { puzzle, solution } = generateSudoku(difficulty);
  return { puzzle, solution };
};

const MIN_LOADING_TIME_MS = 700;

const GameScreen = () => {
  const [initialPuzzle, setInitialPuzzle] = useState<(number | undefined)[][] | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<(number | undefined)[][] | null>(null);
  const [solution, setSolution] = useState<(number | undefined)[][] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const { modal, openModal } = useModal();
  const { time, resetTimer, stopTimer, setIsRunning } = useTimer(true);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isNotesMode, setIsNotesMode] = useState(false);

  const [notes, setNotes] = useState<number[][][]>(
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );

  const handleHint = async () => {
    if (!currentPuzzle) return;
    setIsHintLoading(true);
    setHintMessage(null);
    try {
      const hint = await getHint(currentPuzzle, token ?? undefined);
      setHintMessage(hint);
    } catch (err: any) {
      setHintMessage("Error getting hint.");
      console.error(err);
    } finally {
      setIsHintLoading(false);
    }
  };

  const [undoStack, setUndoStack] = useState<{
    puzzle: (number | undefined)[][],
    notes: number[][][]
  }[]>([]);

  const pushUndo = () => {
    if (!currentPuzzle) return;
    setUndoStack(prev => [
      ...prev,
      {
        puzzle: currentPuzzle.map(row => [...row]),
        notes: notes.map(row => row.map(cell => [...cell]))
      }
    ]);
  };

  const handleUndo = () => {
    const last = undoStack.pop();
    if (last) {
      setCurrentPuzzle(last.puzzle);
      setNotes(last.notes);
      setUndoStack([...undoStack]);
    }
  };

  useEffect(() => {
    setIsRunning(!isMenuOpen && modal !== 'auth' && modal !== 'stats' && modal !== 'difficulty');
  }, [isMenuOpen, modal, setIsRunning]);

  useEffect(() => {
    const { puzzle, solution } = generateNewPuzzle();
    setInitialPuzzle(puzzle);
    setCurrentPuzzle(puzzle.map(row => [...row]));
    setSolution(solution);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const { puzzle, solution } = generateNewPuzzle();
    setInitialPuzzle(puzzle);
    setCurrentPuzzle(puzzle.map(row => [...row]));
    setSolution(solution);

    const elapsed = Date.now() - startTime;
    const timeout = setTimeout(() => setLoading(false), Math.max(0, MIN_LOADING_TIME_MS - elapsed));
    return () => clearTimeout(timeout);
  }, []);

  const AnimatedDots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 200);
      return () => clearInterval(interval);
    }, []);
    return <span className="text-lg font-medium">Loading{dots}</span>;
  };

  const handleNewGame = useCallback((difficulty: Difficulty = 'medium') => {
    setLoading(true);
    const startTime = Date.now();
    const { puzzle, solution } = generateNewPuzzle(difficulty);
    setInitialPuzzle(puzzle);
    setCurrentPuzzle(puzzle.map(row => [...row]));
    setSolution(solution);
    setSelectedNumber(null);
    setSelectedAction(null);
    setIsSolved(false);
    setUndoStack([]);
    resetTimer();

    const elapsed = Date.now() - startTime;
    const timeout = setTimeout(() => setLoading(false), Math.max(0, MIN_LOADING_TIME_MS - elapsed));
    return () => clearTimeout(timeout);
  }, [resetTimer]);

  const handleAutofillNotes = () => {
    if (!currentPuzzle) return;
    setNotes(autofillNotes(currentPuzzle));
  };

  const updateNotes = (rowIndex: number, colIndex: number, number: number) => {
    pushUndo();
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
    pushUndo();
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

    const isBoardFull = updatedPuzzle.every(row => row.every(cell => cell !== undefined));
    if (isBoardFull) {
      const isCorrect = updatedPuzzle.every((row, rowIndex) =>
        row.every((cell, colIndex) => cell === solution?.[rowIndex][colIndex])
      );
      if (isCorrect) stopTimer();
      setIsSolved(isCorrect);
    }
  };

  const clearCell = (row: number, col: number) => {
    if (!currentPuzzle || !initialPuzzle) return;
    if (initialPuzzle[row][col] === undefined) {
      pushUndo();
      const updatedPuzzle = currentPuzzle.map(row => [...row]);
      const updatedNotes = notes.map(row => row.map(cell => [...cell]));
      updatedPuzzle[row][col] = undefined;
      updatedNotes[row][col] = [];
      setCurrentPuzzle(updatedPuzzle);
      setNotes(updatedNotes);
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
        <div className="relative w-full aspect-square bg-gray-100 rounded-md shadow-md flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-gray-700">
              <Loader2 className="animate-spin h-6 w-6 mb-2" />
              <AnimatedDots />
            </div>
          ) : (
            <GameBoard
              key={initialPuzzle?.toString()}
              initialPuzzle={initialPuzzle!}
              currentPuzzle={currentPuzzle!}
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
              updateBoard={updateBoard}
              selectedAction={selectedAction}
              clearCell={clearCell}
              isNotesMode={isNotesMode}
              notes={notes}
              updateNotes={updateNotes}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-md mt-6 flex flex-col gap-4">
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
          <ActionButton icon={Undo2} selected={false} onClick={handleUndo} />
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
            onClick={() => {
              setSelectedAction(null); // hint shouldn't toggle
              handleHint();
            }}
          />
        </div>
      </div>

      {isSolved && <VictoryScreen time={time} />}

      <Menu
        isOpen={isMenuOpen}
        onNewGame={() => openModal('difficulty')}
        onAutofillNotes={handleAutofillNotes}
        onClose={() => setIsMenuOpen(false)}
      />

      {modal === 'difficulty' && <DifficultyModal onSelectDifficulty={handleNewGame} />}

      {hintMessage && (
        <div className="mt-4 text-center text-sm text-yellow-500 px-4 max-w-md">
          💡 {hintMessage}
        </div>
      )}
    </div>
  );
};

export default GameScreen;
