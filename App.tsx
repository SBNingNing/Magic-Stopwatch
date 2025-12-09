import React, { useState, useEffect, useRef } from 'react';
import { AppStage, TrickMode, TimeValue } from './types';
import { formatStopwatch, getTrickTimeMs, getFixedTimeMs } from './utils';
import { Button } from './components/Button';
import { Numpad } from './components/Numpad';
import { Clock, Lock, ArrowRight, Settings2, Play, Pause, RotateCcw, Flag, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [stage, setStage] = useState<AppStage>(AppStage.MODE_SELECTION);
  const [trickMode, setTrickMode] = useState<TrickMode>(TrickMode.CURRENT_TIME);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to Dark Mode
  
  // Settings
  const [fixedTrickTime, setFixedTrickTime] = useState<TimeValue>({ minutes: 0, seconds: 0 });

  // Active Stopwatch State
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  // Track if the timer has ever started to control the button split animation
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Timer Ref
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const previousElapsedRef = useRef<number>(0);

  // --- Theme Classes ---
  const theme = {
    bg: isDarkMode ? "bg-black" : "bg-gray-50",
    textPrimary: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-500",
    cardBg: isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm",
    cardHoverBorder: isDarkMode ? "hover:border-orange-500/50" : "hover:border-orange-500",
    iconBgBlue: isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600",
    iconBgPurple: isDarkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600",
    lapBorder: isDarkMode ? "border-gray-900" : "border-gray-200",
    settingsIcon: isDarkMode ? "text-gray-800 hover:text-gray-600 active:text-white" : "text-gray-300 hover:text-gray-500 active:text-gray-900",
    modeToggleBg: isDarkMode ? "bg-gray-900" : "bg-gray-200",
  };

  // --- Handlers ---

  const handleModeSelect = (mode: TrickMode) => {
    setTrickMode(mode);
    if (mode === TrickMode.FIXED_TIME) {
      setStage(AppStage.SETUP_TRICK_TIME);
    } else {
      setStage(AppStage.ACTIVE_STOPWATCH);
    }
  };

  const handleTrickTimeSet = (time: TimeValue) => {
    setFixedTrickTime(time);
    handleReset(); // Explicitly reset timer to ensure 00:00.00 start
    setStage(AppStage.ACTIVE_STOPWATCH);
  };

  const animate = (time: number) => {
    if (startTimeRef.current !== undefined) {
      const now = Date.now();
      setElapsedTime(previousElapsedRef.current + (now - startTimeRef.current));
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setHasStartedOnce(true);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    previousElapsedRef.current = elapsedTime;
  };

  const handleReset = () => {
    setIsRunning(false);
    setHasStartedOnce(false); 
    setElapsedTime(0);
    previousElapsedRef.current = 0;
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [elapsedTime, ...prev]);
  };

  const handleBack = () => {
    handleReset();
    setStage(AppStage.MODE_SELECTION);
  };

  // --- Render Helpers ---

  // Calculate displayed time (ms)
  const getDisplayTimeMs = (): number => {
    if (isRunning) {
      return elapsedTime;
    }
    if (elapsedTime === 0) {
      return 0; // Ensures it starts at 00:00.00
    }
    // Trick Logic when stopped
    if (trickMode === TrickMode.CURRENT_TIME) {
      return getTrickTimeMs();
    } else {
      return getFixedTimeMs(fixedTrickTime);
    }
  };

  const displayTimeMs = getDisplayTimeMs();
  const { main, centis } = formatStopwatch(displayTimeMs);

  // --- Views ---

  if (stage === AppStage.MODE_SELECTION) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} p-6 flex flex-col justify-center max-w-md mx-auto font-sans transition-colors duration-300`}>
        <div className="flex justify-end mb-4">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className={`p-3 rounded-full ${theme.modeToggleBg} transition-all active:scale-95`}
           >
             {isDarkMode ? <Moon size={20} className="text-blue-300" /> : <Sun size={20} className="text-orange-500" />}
           </button>
        </div>

        <div className="mb-12 space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            魔术计时器
          </h1>
          <p className={theme.textSecondary}>选择你的模式</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleModeSelect(TrickMode.CURRENT_TIME)}
            className={`w-full ${theme.cardBg} ${theme.cardHoverBorder} border p-6 rounded-2xl flex items-center justify-between group transition-all`}
          >
            <div className="flex items-center gap-4">
              <div className={`${theme.iconBgBlue} p-3 rounded-full`}>
                <Clock size={24} />
              </div>
              <div className="text-left">
                <h3 className={`font-semibold text-lg ${theme.textPrimary}`}>实时模式</h3>
                <p className={`text-sm ${theme.textSecondary}`}>停止时显示当前真实时间</p>
              </div>
            </div>
            <ArrowRight className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} group-hover:text-orange-500 transition-colors`} />
          </button>

          <button 
            onClick={() => handleModeSelect(TrickMode.FIXED_TIME)}
            className={`w-full ${theme.cardBg} ${theme.cardHoverBorder} border p-6 rounded-2xl flex items-center justify-between group transition-all`}
          >
            <div className="flex items-center gap-4">
              <div className={`${theme.iconBgPurple} p-3 rounded-full`}>
                <Lock size={24} />
              </div>
              <div className="text-left">
                <h3 className={`font-semibold text-lg ${theme.textPrimary}`}>固定模式</h3>
                <p className={`text-sm ${theme.textSecondary}`}>停止时显示预设时间</p>
              </div>
            </div>
            <ArrowRight className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} group-hover:text-orange-500 transition-colors`} />
          </button>
        </div>
      </div>
    );
  }

  if (stage === AppStage.SETUP_TRICK_TIME) {
    return (
      <div className={`h-screen ${theme.bg} font-sans transition-colors duration-300`}>
        <Numpad 
          title="设置显示时间" 
          subtitle="停止计时后，屏幕将显示此时间"
          onTimeSet={handleTrickTimeSet}
          confirmLabel="进入计时器"
          darkMode={isDarkMode}
        />
      </div>
    );
  }

  // Active Stopwatch View
  return (
    <div className={`h-screen ${theme.bg} flex flex-col py-safe overflow-hidden font-sans select-none transition-colors duration-300`}>
      {/* Hidden Settings Button */}
      <div className="absolute top-4 left-4 z-50">
         <button onClick={handleBack} className={`${theme.settingsIcon} p-4 transition-colors`}>
           <Settings2 size={24} />
         </button>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-[45vh]">
        <div className={`flex items-baseline ${theme.textPrimary} tabular-nums leading-none`}>
          <span className="font-mono font-light text-[22vw] sm:text-9xl tracking-tight">
            {main}
          </span>
          {/* Increased font size for centiseconds as requested */}
          <span className={`font-mono text-[12vw] sm:text-7xl ${theme.textSecondary} ml-1 w-[3ch]`}>
            {centis}
          </span>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex-1 flex flex-col justify-start w-full relative">
         
         {/* Buttons Area */}
         <div className="w-full px-8 sm:px-12 mb-8 h-24 flex items-center justify-center relative">
            
            {/* Single Start Button State */}
            <div 
              className={`absolute transition-all duration-500 ease-out transform ${
                !hasStartedOnce 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
            >
              <Button 
                variant="circle-start" 
                onClick={handleStart}
                style={{ width: '96px', height: '96px' }}
                darkMode={isDarkMode}
              >
                <Play fill="currentColor" size={32} className="ml-1" />
              </Button>
            </div>

            {/* Split Buttons State */}
            <div 
               className={`w-full flex items-center justify-between transition-all duration-500 ease-out transform ${
                 hasStartedOnce 
                   ? 'opacity-100 translate-y-0' 
                   : 'opacity-0 translate-y-12 pointer-events-none'
               }`}
            >
              {/* Left Button: Lap / Reset */}
              <Button 
                variant="circle-neutral" 
                onClick={!isRunning ? handleReset : handleLap}
                disabled={!isRunning && elapsedTime === 0} 
                className="transition-colors duration-300"
                darkMode={isDarkMode}
              >
                {!isRunning ? <RotateCcw size={32} /> : <Flag size={32} />}
              </Button>

              {/* Pagination Dots */}
              <div className="flex gap-2 opacity-30">
                 <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-gray-800'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
              </div>

              {/* Right Button: Stop / Start */}
              <Button 
                variant={isRunning ? "circle-stop" : "circle-start"}
                onClick={isRunning ? handleStop : handleStart}
                className="transition-colors duration-300"
                darkMode={isDarkMode}
              >
                {isRunning ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="ml-1" />}
              </Button>
            </div>

         </div>

         {/* Laps List - Removed top border as requested */}
         <div className={`w-full flex-1 overflow-y-auto px-4 transition-opacity duration-500 ${hasStartedOnce ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-md mx-auto">
               {laps.map((lapTime, index) => {
                 const formattedLap = formatStopwatch(lapTime);
                 return (
                   <div key={index} className={`flex justify-between items-center py-4 border-b ${theme.lapBorder} ${theme.textPrimary} font-mono`}>
                      <span className={theme.textSecondary}>计次 {laps.length - index}</span>
                      <span>
                        {formattedLap.main}<span className={`${theme.textSecondary} text-lg`}>{formattedLap.centis}</span>
                      </span>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;