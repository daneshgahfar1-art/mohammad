import React from 'react';
import Calculator from './components/Calculator';
import PatternBackground from './components/PatternBackground';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
      <PatternBackground />
      
      <div className="z-10 w-full flex flex-col items-center">
        <Calculator />
        
        <footer className="mt-8 text-stone-500 text-sm font-light text-center">
          <p>طراحی شده با الهام از معماری ایرانی اسلامی</p>
          <p className="opacity-60 text-xs mt-1">نسخه ۱.۰</p>
        </footer>
      </div>
    </div>
  );
};

export default App;