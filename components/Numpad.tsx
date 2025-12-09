import React, { useState } from 'react';
import { Delete } from 'lucide-react';

interface NumpadProps {
  onTimeSet: (seconds: number) => void;
  title: string;
  subtitle?: string;
  confirmLabel?: string;
}

export const Numpad: React.FC<NumpadProps> = ({ onTimeSet, title, subtitle, confirmLabel = "开始" }) => {
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
    // Interpret as MM:SS
    const totalSeconds = (parseInt(m) * 60) + parseInt(s);
    if (totalSeconds >= 0) {
      onTimeSet(totalSeconds);
    }
  };

  const { m, s } = formattedDisplay();
  const hasInput = inputString.length > 0;

  return (
    <div className="flex flex-col h-full justify-between py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 flex flex-col justify-center items-center space-y-2">
        <h2 className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{title}</h2>
        {subtitle && <p className="text-gray-500 text-xs text-center max-w-xs">{subtitle}</p>}
        
        <div className="text-6xl sm:text-7xl font-mono text-white tracking-widest my-8 font-light flex items-baseline">
           <span className={inputString.length >= 3 ? "text-white" : "text-gray-700"}>{m.charAt(0)}</span>
           <span className={inputString.length >= 4 ? "text-white" : "text-gray-700"}>{m.charAt(1)}</span>
           <span className="text-gray-600 mx-1">:</span>
           <span className={inputString.length >= 1 ? "text-white" : "text-gray-700"}>{s.charAt(0)}</span>
           <span className={inputString.length >= 2 ? "text-white" : "text-gray-700"}>{s.charAt(1)}</span>
           <span className="text-gray-800 text-4xl ml-2">.00</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-4 max-w-md mx-auto w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num)}
            className="h-16 sm:h-20 bg-gray-800/50 hover:bg-gray-700 active:bg-gray-600 rounded-full text-2xl font-medium text-white transition-colors"
          >
            {num}
          </button>
        ))}
        
        <button
          onClick={() => setInputString("")}
          className="h-16 sm:h-20 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          C
        </button>

        <button
          onClick={() => handleNumClick(0)}
          className="h-16 sm:h-20 bg-gray-800/50 hover:bg-gray-700 active:bg-gray-600 rounded-full text-2xl font-medium text-white transition-colors"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="h-16 sm:h-20 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
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
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20 active:scale-95' 
            : 'bg-gray-900 text-gray-700 cursor-not-allowed'
          }`}
         >
           {confirmLabel}
         </button>
      </div>
    </div>
  );
};