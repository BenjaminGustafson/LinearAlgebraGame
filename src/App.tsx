import { useEffect } from 'react';
import { create } from 'zustand';


type Matrix2x2 = [[number, number], [number, number]];

interface Card {
  id: string;
  matrix: Matrix2x2;
}

// State for current UI
interface UIStore {
  // Matrix stack
  // Matrix hand
  hand: Card[];
  addCardToHand: (card: Card) => void;
  // Open panels
  // Option toggles
}

export const useUIStore = create<UIStore>((set) => ({
  hand: [],
  addCardToHand: (card) => set((state) => ({ hand: [...state.hand, card] })),
}));

// State for 
interface GameStore {
  // Current scene
  // Matrix library
  // Puzzles solved
  // 
}

// State for settings ?

/**
 * The game has a fixed 16:9 ratio
 */
function App() {
  const addCardToHand = useUIStore((state) => state.addCardToHand);

  useEffect(() => {
    const testCard: Card = {id : '0', matrix: [[1, 0], [0, 1]] as Matrix2x2};
    addCardToHand(testCard);
    const testCard2: Card = {id : '1', matrix: [[2, 0], [0, 1]] as Matrix2x2};
    addCardToHand(testCard2);
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
      <div className="relative [aspect-ratio:16/9] h-full max-h-[calc(100vw*9/16)] w-full max-w-[calc(100vh*16/9)] bg-gray-800">
        <Block x={0} y={0} x2={1920} y2={100} className="bg-gray-400" />
        <Block x={0} y={110} x2={1920} y2={220} className="bg-gray-500" />
        <Block x={0} y={230} x2={1920} y2={870} className="bg-gray-400" />
        <Block x={0} y={880} x2={1920} y2={1080} className="bg-gray-500"/>
        <Hand></Hand>
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
  return (
    <Block x={0} y={0} w={50} h={50} className="bg-gray-300"/>
  );
}

function Hand() {
  const hand = useUIStore((state) => state.hand);
  return (
    <div className="flex gap-2">
      {hand.map((card) => (
        <Block x={100} y={880} w={100} h={100} className="bg-gray-700">
          <CardComponent key={card.id} card={card} />
        </Block>
      ))}
    </div>
  );
}



export default App;