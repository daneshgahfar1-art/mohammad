import React from 'react';

interface CalculatorButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equals';
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  className = ''
}) => {
  
  const baseStyles = "relative overflow-hidden rounded-xl p-4 text-xl md:text-2xl font-display shadow-md transition-all duration-150 active:scale-95 active:shadow-inner flex items-center justify-center select-none";
  
  const variants = {
    number: "bg-stone-100 text-stone-800 hover:bg-white border-b-4 border-stone-300 active:border-b-0 active:translate-y-1",
    operator: "bg-teal-700 text-stone-100 hover:bg-teal-600 border-b-4 border-teal-900 active:border-b-0 active:translate-y-1",
    action: "bg-red-50 text-red-900 hover:bg-red-100 border-b-4 border-red-200 active:border-b-0 active:translate-y-1",
    equals: "bg-amber-600 text-white hover:bg-amber-500 border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 col-span-2",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;