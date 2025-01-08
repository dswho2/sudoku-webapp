export type SudokuBoard = (number | undefined)[][];

/**
 * Generates a fully solved Sudoku board using backtracking.
 * @returns {SudokuBoard} A valid solved Sudoku board.
 */
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

        for (let num = 1; num <= 9; num++) {
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

/**
 * Solves a Sudoku board and determines if it has a unique solution.
 * @param board The Sudoku board to solve.
 * @param findAll Whether to find more than one solution.
 * @returns {boolean} Whether the board has a unique solution.
 */
const hasUniqueSolution = (board: SudokuBoard, findAll = false): boolean => {
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
            return solutions > 1; // Stop if more than one solution is found
        }
        if (col === 9) return solve(row + 1, 0);
        if (clone[row][col] !== undefined) return solve(row, col + 1);

        for (let num = 1; num <= 9; num++) {
            if (isSafeToPlace(row, col, num)) {
                clone[row][col] = num;
                if (solve(row, col + 1) && findAll) return true;
                clone[row][col] = undefined;
            }
        }
        return false;
    };

    solve();
    return solutions === 1;
};

/**
 * Creates a Sudoku puzzle by removing numbers from a solved board.
 * Ensures the puzzle has a unique solution.
 * @param solvedBoard A fully solved Sudoku board.
 * @param clues The number of clues to leave on the board (default: 30).
 * @returns {SudokuBoard} A Sudoku puzzle with a unique solution.
 */
const createPuzzle = (solvedBoard: SudokuBoard, clues: number = 30): SudokuBoard => {
    const puzzle = solvedBoard.map(row => [...row]);
    const positions = Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]);

    // Shuffle positions randomly
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (const [row, col] of positions) {
        const backup = puzzle[row][col];
        puzzle[row][col] = undefined;

        if (!hasUniqueSolution(puzzle)) {
            puzzle[row][col] = backup; // Restore the number if uniqueness is lost
        }

        // Stop removing cells once we reach the desired number of clues
        const remainingClues = puzzle.flat().filter(cell => cell !== undefined).length;
        if (remainingClues <= clues) break;
    }

    return puzzle;
};

/**
 * Generates a new Sudoku puzzle and its solution.
 * @param clues Number of clues to leave (default: 30 for medium difficulty).
 * @returns {SudokuGame} An object containing the puzzle and the solution.
 */
export const generateSudoku = (clues: number = 30): { puzzle: SudokuBoard; solution: SudokuBoard } => {
    // if (clues < 17 || clues > 81) {
    //     throw new Error("Clues must be between 17 and 81.");
    // }
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, clues);

    return {
        puzzle,
        solution: solvedBoard,
    };
};
