// GameBoard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import SudokuCell from './SudokuCell';

interface GameBoardProps {
  initialPuzzle: (number | undefined)[][];
  currentPuzzle: (number | undefined)[][];
  selectedNumber: number | null;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number | null>>;
  updateBoard: (rowIndex: number, colIndex: number, number: number) => void;
}

const GameBoard = ({
  initialPuzzle,
  currentPuzzle,
  selectedNumber,
  setSelectedNumber,
  updateBoard,
}: GameBoardProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  const isValidMove = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && currentPuzzle[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && currentPuzzle[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (i !== row && j !== col && currentPuzzle[i][j] === num) return false;
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    // set highlighted number to cell value if there is value, or null if value is undefined
    setHighlightedNumber(currentPuzzle[row][col] ?? null);

    // if no currently selected cell or a new cell has been clicked
    if (selectedCell === null || (selectedCell.row !== row || selectedCell.col !== col) ) {
        setSelectedCell({ row, col });
    } else { // else, must be unselecting a cell
        setSelectedCell(null);
        setHighlightedNumber(null);
    }
  };

  const handleNumberPlacement = useCallback((row: number, col: number, number: number) => {
    if (initialPuzzle[row][col] === undefined) {
      if (currentPuzzle[row][col] === number) {
        updateBoard(row, col, number); // This will clear the number
      } else {
        updateBoard(row, col, number);
      }
    }
  }, [currentPuzzle, initialPuzzle, updateBoard]);

  const isConflicted = (row: number, col: number): boolean => {
    const value = currentPuzzle[row][col];
    if (!value) return false;

    const originalValue = currentPuzzle[row][col];
    currentPuzzle[row][col] = undefined;
    const isValid = isValidMove(row, col, originalValue!);
    currentPuzzle[row][col] = originalValue;

    return !isValid;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCell) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          if (initialPuzzle[selectedCell.row][selectedCell.col] === undefined) {
            handleNumberPlacement(selectedCell.row, selectedCell.col, num);
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          if (initialPuzzle[selectedCell.row][selectedCell.col] === undefined) {
            updateBoard(selectedCell.row, selectedCell.col, undefined!);
          }
        } else if (e.key === 'ArrowUp' && selectedCell.row > 0) {
          setSelectedCell({ row: selectedCell.row - 1, col: selectedCell.col });
        } else if (e.key === 'ArrowDown' && selectedCell.row < 8) {
          setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
        } else if (e.key === 'ArrowLeft' && selectedCell.col > 0) {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col - 1 });
        } else if (e.key === 'ArrowRight' && selectedCell.col < 8) {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, initialPuzzle, handleNumberPlacement, updateBoard]);

  useEffect(() => {
    if (selectedNumber !== null && selectedCell) {
      handleNumberPlacement(selectedCell.row, selectedCell.col, selectedNumber);
      setSelectedNumber(null);
    }
  }, [selectedNumber, selectedCell, handleNumberPlacement, setSelectedNumber]);

  const getCellBorderClasses = (row: number, col: number) => {
    let classes = 'w-full h-full border-gray-200 border';
    if (row % 3 === 0 && row !== 0) classes += ' border-t-2 border-t-gray-800';
    if (col % 3 === 0 && col !== 0) classes += ' border-l-2 border-l-gray-800';
    return classes;
  };

  return (
    <div className="w-full aspect-square border-2 border-gray-800 bg-white rounded-lg overflow-hidden">
      <div className="grid grid-cols-9 gap-0 w-full h-full">
        {currentPuzzle.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellBorderClasses(rowIndex, colIndex)}
            >
              <SudokuCell
                value={currentPuzzle[rowIndex][colIndex]}
                editable={initialPuzzle[rowIndex][colIndex] === undefined}
                highlighted={
                  !!(
                    selectedCell &&
                    (rowIndex === selectedCell.row ||
                      colIndex === selectedCell.col ||
                      (Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
                        Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3)))
                  ) || (highlightedNumber !== null && currentPuzzle[rowIndex][colIndex] === highlightedNumber)
                }
                selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isConflicted={isConflicted(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;