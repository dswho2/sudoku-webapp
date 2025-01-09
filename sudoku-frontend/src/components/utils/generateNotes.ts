const getPossibleNumbers = (
    puzzle: (number | undefined)[][],
    row: number,
    col: number
  ): number[] => {
    if (puzzle[row][col] !== undefined) return [];
    
    const possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    // Check row
    puzzle[row].forEach(num => {
      if (num !== undefined) possibilities.delete(num);
    });
    
    // Check column
    for (let i = 0; i < 9; i++) {
      const num = puzzle[i][col];
      if (num !== undefined) possibilities.delete(num);
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        const num = puzzle[i][j];
        if (num !== undefined) possibilities.delete(num);
      }
    }
    
    return Array.from(possibilities).sort((a, b) => a - b);
  };
  
  export const updateNotesAfterMove = (
    notes: number[][][],
    puzzle: (number | undefined)[][],
    row: number,
    col: number,
    number: number
  ): number[][][] => {
    const updatedNotes = notes.map(row => row.map(cell => [...cell]));
    
    // Remove number from notes in the same row
    for (let j = 0; j < 9; j++) {
      updatedNotes[row][j] = updatedNotes[row][j].filter(n => n !== number);
    }
    
    // Remove number from notes in the same column
    for (let i = 0; i < 9; i++) {
      updatedNotes[i][col] = updatedNotes[i][col].filter(n => n !== number);
    }
    
    // Remove number from notes in the same 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        updatedNotes[i][j] = updatedNotes[i][j].filter(n => n !== number);
      }
    }
    
    return updatedNotes;
  };
  
  export const autofillNotes = (puzzle: (number | undefined)[][]): number[][][] => {
    const notes: number[][][] = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => [])
    );
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === undefined) {
          notes[row][col] = getPossibleNumbers(puzzle, row, col);
        }
      }
    }
    
    return notes;
  };