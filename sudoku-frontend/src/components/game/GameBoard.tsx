import React, { useState, useEffect, useCallback} from 'react';
import SudokuCell from './SudokuCell';

interface GameBoardProps {
    initialPuzzle: (number | undefined)[][];
    selectedNumber: number | null;
    setSelectedNumber: React.Dispatch<React.SetStateAction<number | null>>;
}

const GameBoard = ({ initialPuzzle, selectedNumber, setSelectedNumber }: GameBoardProps) => {
    const [board, setBoard] = useState<(number | undefined)[][]>(initialPuzzle.map(row => [...row]));
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

    const isValidMove = (row: number, col: number, num: number): boolean => {
        // Check row
        for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (i !== row && j !== col && board[i][j] === num) return false;
        }
        }

        return true;
    };

    const handleCellClick = (row: number, col: number) => {
        // console.log('Selected number:', selectedNumber); // Debugging line
        if (selectedCell?.row === row && selectedCell?.col === col) {
            // If the cell is already selected, unselect it
            setSelectedCell(null);
        } else if (selectedNumber !== null) {
            // If a number is selected, place it in the clicked cell or clear it if it's already there
            handleNumberPlacement(row, col);
        } else {
            // If no number is selected, select the cell
            setSelectedCell({ row, col });
        }
    };

    // Wrap handleNumberPlacement in useCallback to avoid re-creating it on each render
    const handleNumberPlacement = useCallback((row: number, col: number) => {
        if (selectedNumber !== null && initialPuzzle[row][col] === undefined) {
            const newBoard = [...board];
            // If the cell already has the selected number, clear it
            if (board[row][col] === selectedNumber) {
                newBoard[row][col] = undefined;
            } else {
                newBoard[row][col] = selectedNumber; // Place the selected number in the cell
            }
            setBoard(newBoard); // Update the board state
        }
    }, [board, selectedNumber]);

    // Check if a cell conflicts with Sudoku rules
    const isConflicted = (row: number, col: number): boolean => {
        const value = board[row][col];
        if (!value) return false;

        const originalValue = board[row][col];
        board[row][col] = undefined; // Temporarily remove the value to check if it conflicts
        const isValid = isValidMove(row, col, originalValue!);
        board[row][col] = originalValue; // Restore the value

        return !isValid;
    };

    // useEffect that runs when selectedNumber changes
    useEffect(() => {
        if (selectedNumber !== null && selectedCell) {
            handleNumberPlacement(selectedCell.row, selectedCell.col);
            setSelectedNumber(null);
        }
    }, [selectedNumber, selectedCell, handleNumberPlacement, setSelectedNumber]); // Run when selectedNumber changes

    const getCellBorderClasses = (row: number, col: number) => {
        let classes = 'w-full h-full border-gray-200 border';
        if (row % 3 === 0 && row !== 0) classes += ' border-t-2 border-t-gray-800';
        if (col % 3 === 0 && col !== 0) classes += ' border-l-2 border-l-gray-800';
        return classes;
    };

    return (
        <div className="w-full aspect-square border-2 border-gray-800 bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-9 gap-0 w-full h-full">
            {board.map((row, rowIndex) =>
            row.map((_, colIndex) => (
                <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellBorderClasses(rowIndex, colIndex)}
                >
                <SudokuCell
                    value={board[rowIndex][colIndex]}
                    editable={initialPuzzle[rowIndex][colIndex] === undefined}
                    highlighted={!!(
                    selectedCell &&
                    (rowIndex === selectedCell.row ||
                        colIndex === selectedCell.col ||
                        (Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
                        Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3)))
                    )}
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
