import { useEffect, useRef, useState } from 'react';
import type { Card } from './components/Card';
import type { Mat2 } from './types/Matrix';
import { useUIStore } from './stores/UIStore';
import { DesmosGraph } from './components/DesmosGraph';
import { MatrixStack } from './components/MatrixStack';
import { Hand } from './components/Hand';
import MatrixBuilder from './components/MatrixBuilder';

function App() {
  const addCardToHand = useUIStore((state) => state.addCardToHand);
  const addCardToStack = useUIStore((state) => state.addCardToStack);
  const popStack = useUIStore((state) => state.popStack);
  const toggleMatrixBuilder = useUIStore((state) => state.toggleMatrixBuilder);


  useEffect(() => {
    const testCard: Card = { id: '0', matrix: [[1, 0], [0, 1]] as Mat2 };
    addCardToHand(testCard);
    const testCard2: Card = { id: '1', matrix: [[2, 0], [0, 1]] as Mat2 };
    addCardToHand(testCard2);
    const testCard3: Card = { id: '2', matrix: [[2, -1], [0, 1]] as Mat2 };
    addCardToStack(testCard3);
  }, []);

  return (
    <ScaledGameContainer>
      <Block x={0} y={0} x2={1920} y2={100} className="bg-gray-400" />
      <Block x={0} y={110} x2={1920} y2={220} className="bg-gray-500" />
      <Block x={0} y={230} x2={1920} y2={870} className="bg-gray-400" />
      <Block x={0} y={880} x2={1920} y2={1080} className="bg-gray-500" />
      <Hand />
      <MatrixStack />
      <div className="absolute text-white text-[48px]" style={{ left: 400, top: 20 }}>
        Skewbert's Matrix Factory
      </div>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 120, width: 100, height: 60, fontSize: 24 }}
        onClick={() => popStack()}
      >
        Undo
      </button>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 1700, top: 900, width: 150, height: 150, fontSize: 24 }}
        onClick={() => { toggleMatrixBuilder() }}
      >
        New Matrix
      </button>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 900, width: 150, height: 150, fontSize: 24 }}
        onClick={() => { }}
      >
        Matrix Library
      </button>
      <DesmosGraph />
      <MatrixBuilder/>
    </ScaledGameContainer>
  );
}

/**
 * The game has a fixed 16:9 ratio
 */
function ScaledGameContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
      <div
        ref={containerRef}
        style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0 }}
        className="bg-gray-100"
      >
        {children}
      </div>
    </div>
  );
}


// Helper function to place absolute coords within app
function Block({ x, y, w, h, x2, y2, className }: {
  x: number; y: number;
  w?: number; h?: number;
  x2?: number; y2?: number;
  className?: string
}) {
  const width = w ?? (x2! - x);
  const height = h ?? (y2! - y);

  return (
    <div
      className={`absolute ${className}`}
      style={{ left: `${x * 100 / 1920}%`, top: `${y * 100 / 1080}%`, width: `${width * 100 / 1920}%`, height: `${height * 100 / 1080}%` }}
    />
  );
}

export default App;