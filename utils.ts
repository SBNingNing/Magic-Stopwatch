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
// Input comes from Numpad as total seconds (interpreted as Minutes:Seconds in numpad)
// We need to remap this: Input Minutes -> Output Seconds, Input Seconds -> Output Centiseconds
export const getFixedTimeMs = (totalSecondsFromNumpad: number): number => {
  // Reconstruct the visual input from Numpad
  const inputM = Math.floor(totalSecondsFromNumpad / 60);
  const inputS = totalSecondsFromNumpad % 60;

  // Map to Stopwatch logic: M -> S, S -> cs
  return (inputM * 1000) + (inputS * 10);
};