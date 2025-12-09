import { TimeValue } from './types';

// Format milliseconds to MM:SS.ss
export const formatStopwatch = (ms: number) => {
  // Ensure non-negative
  ms = Math.max(0, ms);
  
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10); // 0-99

  return {
    main: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
    centis: `.${centis.toString().padStart(2, '0')}`
  };
};

export const formatTimeValue = (val: TimeValue): string => {
  return `${val.minutes.toString().padStart(2, '0')}:${val.seconds.toString().padStart(2, '0')}`;
};

// Returns current time formatted as milliseconds for the stopwatch
// Mapping: Clock Hours -> Stopwatch Seconds, Clock Minutes -> Stopwatch Centiseconds
// Example: 18:01 clock -> 00m 18s 01cs stopwatch -> Display 00:18.01
export const getTrickTimeMs = (): number => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  
  // Hours become seconds (h * 1000)
  // Minutes become centiseconds (m * 10)
  return (h * 1000) + (m * 10);
};

// Helper for fixed time trick
// Input comes from Numpad as two parts: minutes (left) and seconds (right)
// Mapping: Input Left (Minutes) -> Stopwatch Seconds
// Mapping: Input Right (Seconds) -> Stopwatch Centiseconds
export const getFixedTimeMs = (time: TimeValue): number => {
  // Map Input Minutes -> Seconds (x1000 ms)
  // Map Input Seconds -> Centiseconds (x10 ms)
  return (time.minutes * 1000) + (time.seconds * 10);
};