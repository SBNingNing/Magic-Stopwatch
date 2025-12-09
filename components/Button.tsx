import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'circle-start' | 'circle-stop' | 'circle-neutral';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-medium";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl text-lg",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-xl text-lg",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 py-3 px-6 rounded-xl text-lg",
    
    // Circular buttons for the timer interface (iOS style)
    'circle-start': "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-900/40 text-green-400 border-2 border-green-900 flex items-center justify-center text-lg sm:text-xl",
    'circle-stop': "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-900/40 text-orange-400 border-2 border-orange-900 flex items-center justify-center text-lg sm:text-xl",
    'circle-neutral': "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-800 text-gray-300 border-2 border-gray-700 flex items-center justify-center text-lg sm:text-xl",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};