import { useEffect, useRef, useState } from 'react';
import { numericCard, type Card } from './components/Card';
import type { Mat2 } from './types/Matrix';
import { useUIState, useStackProduct } from './stores/UIState';
import { DesmosGraph } from './components/DesmosGraph';
import { MatrixStack } from './components/MatrixStack';
import { Hand } from './components/Hand';
import MatrixBuilder from './components/MatrixBuilder';
import { useGameState } from './stores/GameState';
import { ToggleButton } from './components/ToggleButton';

function App() {
  const addCardToHand = useUIState((state) => state.addCardToHand);
  const addCardToStack = useUIState((state) => state.addCardToStack);
  const popStack = useUIState((state) => state.popStack);
  const toggleMatrixBuilder = useUIState((state) => state.toggleMatrixBuilder);
  const setFixedLHS = useGameState(state => state.setFixedLHS);
  const toggleSimplify = useUIState(state => state.toggleSimplify);
  const toggleResultTarget = useUIState(state => state.toggleResultTarget);

  useEffect(() => {
    const testCard: Card = numericCard([[2, 0], [0, 1]])
    addCardToHand(testCard);
    setFixedLHS([numericCard([[1, 1], [0, 2]])]);
    // const testCard2: Card = {  matrix: [[2, 0], [0, 1]] as Mat2 };
    // addCardToHand(testCard2);
    // const testCard3: Card = {  matrix: [[2, -1], [0, 1]] as Mat2 };
    // addCardToStack(testCard3);
  }, []);

  return (
    <ScaledGameContainer>
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
      <div className="absolute"
        style={{ left: 250, top: 150 }}>
          <ToggleButton
            label="Simplify"
            onChange={ () => { toggleSimplify() }}
          />
          <ToggleButton
            label="Show result"
            defaultEnabled={true}
            onChange={ () => { toggleResultTarget() }}
          />
      </div>
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
    <div className="w-screen h-screen bg-gray-600 flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0 }}
        className="bg-gray-500"
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