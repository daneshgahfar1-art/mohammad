import React from 'react';

const PatternBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #0f766e 2px, transparent 2.5px),
            radial-gradient(circle at 0% 0%, #0f766e 2px, transparent 2.5px),
            radial-gradient(circle at 100% 0%, #0f766e 2px, transparent 2.5px),
            radial-gradient(circle at 100% 100%, #0f766e 2px, transparent 2.5px),
            radial-gradient(circle at 0% 100%, #0f766e 2px, transparent 2.5px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default PatternBackground;