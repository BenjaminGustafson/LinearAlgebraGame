import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';


type Matrix2x2 = [[number, number], [number, number]];

interface Card {
  id: string;
  matrix: Matrix2x2;
}

// State for current UI
interface UIStore {
  // Matrix stack
  matrixStack: Card[];
  addCardToStack: (card: Card) => void;

  // Matrix hand
  hand: Card[];
  addCardToHand: (card: Card) => void;
  // Open panels
  // Option toggles
}

export const useUIStore = create<UIStore>((set) => ({
  hand: [],
  matrixStack: [],
  addCardToHand: (card) => set((state) => ({ hand: [...state.hand, card] })),
  addCardToStack: (card) => set((state) => ({ matrixStack: [...state.matrixStack, card] })),
}));

// State for 
interface GameStore {
  // Current scene
  // Matrix library
  // Puzzles solved
  // 
}

// State for settings ?


function App() {
  const addCardToHand = useUIStore((state) => state.addCardToHand);
  const addCardToStack = useUIStore((state) => state.addCardToStack);

  useEffect(() => {
    const testCard: Card = {id : '0', matrix: [[1, 0], [0, 1]] as Matrix2x2};
    addCardToHand(testCard);
    const testCard2: Card = {id : '1', matrix: [[2, 0], [0, 1]] as Matrix2x2};
    addCardToHand(testCard2);
    const testCard3: Card = {id : '2', matrix: [[2, -1], [0, 1]] as Matrix2x2};
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
        Skewbert
      </div>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 120, width: 100, height: 60, fontSize: 24 }}
        onClick={() => console.log('clicked')}
      >
         Undo
      </button>
      
      <div
        className="absolute bg-gray-700 rounded-xl border border-gray-500 shadow-lg flex flex-col items-center justify-center text-white"
        style={{ left: 760, top: 340, width: 400, height: 400, fontSize: 24 }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚔️</div>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>Attack Card</div>
        <div style={{ fontSize: 20, color: '#9ca3af', marginTop: 8 }}>Deal 5 damage</div>
      </div>

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
        style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0}}
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

/**
 * 
 * A card should have the four numbers of the matrix drawn in a grid
 * And be a square div
 * Later: dnd-kit
 */
function CardComponent({ card }: { card: Card }) {
  const [[a, b], [c, d]] = card.matrix;

  return (
    <div style={{
      width: 100,
      height: 100,
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 24px',
        fontSize: 28,
        fontWeight: 500,
        color: 'white',
        fontFamily: 'monospace',
      }}>
        <span style={{ textAlign: 'right' }}>{a}</span>
        <span style={{ textAlign: 'left'  }}>{b}</span>
        <span style={{ textAlign: 'right' }}>{c}</span>
        <span style={{ textAlign: 'left'  }}>{d}</span>
      </div>
    </div>
  );
}

function Hand() {
  const hand = useUIStore((state) => state.hand);

  const cardWidth = 200;
  const cardGap = 16;
  const totalWidth = hand.length * cardWidth + (hand.length - 1) * cardGap;
  const startX = (1920 - totalWidth) / 2;

  return (
    <>
      {hand.map((card, i) => {
        const x = startX + i * (cardWidth + cardGap);
        return (
          <div
            key={card.id}
            style={{ position: 'absolute', left: x, top: 800 }}
          >
            <CardComponent card={card} />
          </div>
        );
      })}
    </>
  );
}

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
function MatrixStack() {
  const stack = useUIStore((state) => state.matrixStack);

  const cardWidth = 100;// TODO magic number
  const cardGap = 16;
  const startX = 1000;

  return (
    <>
      {stack.map((card, i) => {
        const x = startX - i * (cardWidth + cardGap);
        return (
          <div
            key={card.id}
            style={{ position: 'absolute', left: x, top: 120 }}
          >
            <CardComponent card={card} />
          </div>
        );
      })}
    </>
  );
}


export default App;