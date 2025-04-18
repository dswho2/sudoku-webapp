// src/hooks/useTimer.ts

import { useState, useEffect, useRef } from 'react';

const useTimer = (startRunning: boolean = true) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(startRunning);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(true); // restart timer
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { time: formatTime(), seconds, stopTimer, resetTimer, setIsRunning };
};

export default useTimer;
