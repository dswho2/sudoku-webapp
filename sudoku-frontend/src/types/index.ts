// types/index.ts
export interface SudokuBoard {
    cells: number[][];
    initialCells: boolean[][];  // To track which cells were pre-filled
    notes: Set<number>[][][];   // For pencil marks
}

export interface GameState {
board: SudokuBoard;
selectedCell: { row: number; col: number } | null;
isNotesMode: boolean;
gameStartTime: Date;
isPaused: boolean;
}