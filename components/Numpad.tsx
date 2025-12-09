import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { TimeValue } from '../types';

interface NumpadProps {
  onTimeSet: (time: TimeValue) => void;
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  darkMode?: boolean;
}

export const Numpad: React.FC<NumpadProps> = ({ onTimeSet, title, subtitle, confirmLabel = "开始", darkMode = true }) => {
  const [inputString, setInputString] = useState<string>("");

  const formattedDisplay = () => {
    const raw = inputString.padStart(4, '0');
    const m = raw.slice(0, 2);
    const s = raw.slice(2, 4);
    return { m, s };
  };

  const handleNumClick = (num: number) => {
    if (inputString.length < 4) {
      setInputString(prev => prev + num.toString());
    }
  };

  const handleDelete = () => {
    setInputString(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const { m, s } = formattedDisplay();
    // Pass raw values directly to preserve visual mapping
    // Left part (m) and Right part (s)
    onTimeSet({ minutes: parseInt(m), seconds: parseInt(s) });
  };

  const { m, s } = formattedDisplay();
  const hasInput = inputString.length > 0;

  // Theme-based classes
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-500";
  const textMuted = darkMode ? "text-gray-700" : "text-gray-300";
  const keyBg = darkMode ? "bg-gray-800/50 hover:bg-gray-700 active:bg-gray-600" : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400";
  const keyText = darkMode ? "text-white" : "text-gray-900";
  const confirmBtnActive = "bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-95";
  const confirmBtnDisabled = darkMode ? "bg-gray-900 text-gray-700 cursor-not-allowed" : "bg-gray-100 text-gray-300 cursor-not-allowed";

  return (
    <div className="flex flex-col h-full justify-between py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 flex flex-col justify-center items-center space-y-2">
        <h2 className={`${textSecondary} text-sm uppercase tracking-wider font-semibold`}>{title}</h2>
        {subtitle && <p className={`${textSecondary} text-xs text-center max-w-xs opacity-75`}>{subtitle}</p>}
        
        <div className={`text-6xl sm:text-7xl font-mono tracking-widest my-8 font-light flex items-baseline ${textPrimary}`}>
           <span className={inputString.length >= 3 ? textPrimary : textMuted}>{m.charAt(0)}</span>
           <span className={inputString.length >= 4 ? textPrimary : textMuted}>{m.charAt(1)}</span>
           <span className={`${textSecondary} mx-1 opacity-50`}>:</span>
           <span className={inputString.length >= 1 ? textPrimary : textMuted}>{s.charAt(0)}</span>
           <span className={inputString.length >= 2 ? textPrimary : textMuted}>{s.charAt(1)}</span>
           <span className={`${textSecondary} text-4xl ml-2 opacity-50`}>.00</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-4 max-w-md mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num)}
            className={`h-16 sm:h-20 rounded-full text-2xl font-medium transition-colors ${keyBg} ${keyText}`}
          >
            {num}
          </button>
        ))}
        
        <button
          onClick={() => setInputString("")}
          className={`h-16 sm:h-20 flex items-center justify-center transition-colors ${textSecondary} hover:${textPrimary}`}
        >
          C
        </button>

        <button
          onClick={() => handleNumClick(0)}
          className={`h-16 sm:h-20 rounded-full text-2xl font-medium transition-colors ${keyBg} ${keyText}`}
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className={`h-16 sm:h-20 flex items-center justify-center transition-colors ${textSecondary} hover:${textPrimary}`}
        >
          <Delete size={28} />
        </button>
      </div>

      <div className="mt-8 max-w-md mx-auto w-full">
         <button
          onClick={handleConfirm}
          disabled={!hasInput}
          className={`w-full py-4 rounded-full text-xl font-bold tracking-wide transition-all ${
            hasInput 
            ? confirmBtnActive 
            : confirmBtnDisabled
          }`}
         >
           {confirmLabel}
         </button>
      </div>
    </div>
  );
};