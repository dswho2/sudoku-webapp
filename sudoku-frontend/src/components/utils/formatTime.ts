// src/components/utils/formatTime.ts

export const formatTime = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined) return '-';
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};