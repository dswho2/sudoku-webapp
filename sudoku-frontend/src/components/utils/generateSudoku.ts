// src/components/utils/generateSudoku.ts

export type SudokuBoard = (number | undefined)[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

const clueCounts: Record<Difficulty, number> = {
  easy: 40,
  medium: 32,
  hard: 24,
};

const generateSolvedBoard = (): SudokuBoard => {
  const board: SudokuBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(undefined));

  const isSafeToPlace = (row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
      const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      const boxCol = Math.floor(col / 3) * 3 + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const solve = (row = 0, col = 0): boolean => {
    if (row === 9) return true;
    if (col === 9) return solve(row + 1, 0);
    if (board[row][col] !== undefined) return solve(row, col + 1);

    const numbers = [...Array(9)].map((_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    for (let num of numbers) {
      if (isSafeToPlace(row, col, num)) {
        board[row][col] = num;
        if (solve(row, col + 1)) return true;
        board[row][col] = undefined;
      }
    }
    return false;
  };

  solve();
  return board;
};

const hasUniqueSolution = (board: SudokuBoard): boolean => {
  const clone = board.map(row => [...row]);
  let solutions = 0;

  const isSafeToPlace = (row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (clone[row][i] === num || clone[i][col] === num) return false;
      const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      const boxCol = Math.floor(col / 3) * 3 + (i % 3);
      if (clone[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const solve = (row = 0, col = 0): boolean => {
    if (row === 9) {
      solutions++;
      return solutions > 1;
    }
    if (col === 9) return solve(row + 1, 0);
    if (clone[row][col] !== undefined) return solve(row, col + 1);

    for (let num = 1; num <= 9; num++) {
      if (isSafeToPlace(row, col, num)) {
        clone[row][col] = num;
        if (solve(row, col + 1)) return true;
        clone[row][col] = undefined;
      }
    }
    return false;
  };

  solve();
  return solutions === 1;
};

const createPuzzle = (solvedBoard: SudokuBoard, clues: number): SudokuBoard => {
  const puzzle = solvedBoard.map(row => [...row]);
  const positions = Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]);

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (const [row, col] of positions) {
    const backup = puzzle[row][col];
    puzzle[row][col] = undefined;
    if (!hasUniqueSolution(puzzle)) {
      puzzle[row][col] = backup;
    }

    const remainingClues = puzzle.flat().filter(cell => cell !== undefined).length;
    if (remainingClues <= clues) break;
  }

  return puzzle;
};

export const generateSudoku = (difficulty: Difficulty = 'medium'): { puzzle: SudokuBoard; solution: SudokuBoard } => {
  const solvedBoard = generateSolvedBoard();
  const puzzle = createPuzzle(solvedBoard, clueCounts[difficulty]);
  return {
    puzzle,
    solution: solvedBoard,
  };
};
