import React from 'react';


/**
 * The game has a fixed 16:9 ratio
 */
function App() {
  return (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
      <div className="relative [aspect-ratio:16/9] h-full max-h-[calc(100vw*9/16)] w-full max-w-[calc(100vh*16/9)] bg-gray-800">
        <Block x={0.1} y={0.2} w={0.8} h={0.1} className="bg-gray-500" />
      </div>
    </div>
  );
}

// Helper function to place absolute coords within app
function Block({ x, y, w, h, className }: { x: number; y: number; w: number; h: number; className?: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }}
    />
  );
}

export default App;