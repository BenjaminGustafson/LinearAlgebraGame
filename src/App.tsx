import { useEffect, useRef, useState, useMemo } from 'react';
import { create } from 'zustand';
declare const Desmos: any; 


type Matrix2x2 = [[number, number], [number, number]];


function multiply2x2(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return [
    [a[0][0]*b[0][0] + a[0][1]*b[1][0],  a[0][0]*b[0][1] + a[0][1]*b[1][1]],
    [a[1][0]*b[0][0] + a[1][1]*b[1][0],  a[1][0]*b[0][1] + a[1][1]*b[1][1]],
  ];
}

const identity: Matrix2x2 = [[1,0],[0,1]];



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
  playCard: (id: string) => void;   // hand -> stack
  returnCard: (id: string) => void; // stack -> hand
  popStack: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  hand: [],
  matrixStack: [],
  addCardToHand: (card) => set((state) => ({ hand: [...state.hand, card] })),
  addCardToStack: (card) => set((state) => ({ matrixStack: [...state.matrixStack, card] })),
  playCard: (id) => set((state) => {
    const card = state.hand.find(c => c.id === id);
    if (!card) return state;
    return {
      hand: state.hand.filter(c => c.id !== id),
      matrixStack: [...state.matrixStack, card],
    };
  }),
  returnCard: (id) => set((state) => {
    const card = state.matrixStack.find(c => c.id === id);
    if (!card) return state;
    return {
      matrixStack: state.matrixStack.filter(c => c.id !== id),
      hand: [...state.hand, card],
    };
  }),
  popStack: () => set((state) => {
    if (state.matrixStack.length == 0){
      return {}
    }
    const card = state.matrixStack[state.matrixStack.length-1]
    return {
      matrixStack: state.matrixStack.filter(c => c.id !== card.id),
      hand: [...state.hand, card],
    }
  })
}));

/**
 * Multiply the matrix stack
 * Multiplies from left to right (stack is rendered in opposite direction)
 * If stack is empty return identity
 */
export const useStackProduct = (): Matrix2x2 => {
  const matrixStack = useUIStore((state) => state.matrixStack);
  return useMemo(
    () => matrixStack.reduce((acc, card) => multiply2x2(acc, card.matrix), identity),
    [matrixStack]
  );
};

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
  const popStack = useUIStore((state) => state.popStack);

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
        Skewbert's Matrix Factory
      </div>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 120, width: 100, height: 60, fontSize: 24 }}
        onClick={() => popStack()}
      >
         Undo
      </button>
      <DesmosGraph />
      

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


function DesmosGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<Desmos.Calculator | null>(null);
  const transform: Matrix2x2 = useStackProduct()

  useEffect(() => {
    if (!containerRef.current) return;
    calculatorRef.current = Desmos.GraphingCalculator(containerRef.current, {
      keypad: false,
      expressions: false,
      showGrid:false,
    });
    const calculator = calculatorRef.current!;
    // Based on https://www.desmos.com/calculator/yfeeqwkrhd
    //calculator.setExpression({ id: 'graph1', latex: 'y = x^2' });
    calculator.setExpression({ latex: 'n = 10' });
    calculator.setExpression({ id:'a', latex: 'a=1' });
    calculator.setExpression({ id:'b', latex: 'b=0' });
    calculator.setExpression({ id:'c', latex: 'c=0' });
    calculator.setExpression({ id:'d', latex: 'd=1' });
    calculator.setExpression({ latex: 'L=[-n...n]' });
    calculator.setExpression({ latex: 'i=(a,c)', hidden: 'true'});
    calculator.setExpression({ latex: 'j=(b,d)', hidden:'true'});
    calculator.setExpression({ latex: 'Lj+t(a,c)', parametricDomain: { min: '-n', max: 'n'}, color:'blue'});
    calculator.setExpression({ latex: 'Li+t(b,d)', parametricDomain: { min: '-n', max: 'n'}, color:'blue' });

    return () => calculator.destroy();
  }, []);

  // Update transform
  useEffect(() => {
    if (!containerRef.current) return;
    const calculator = calculatorRef.current!;
    calculator.setExpression({ id:'a', latex: `a=${transform[0][0]}` });
    calculator.setExpression({ id:'b', latex: `b=${transform[0][1]}` });
    calculator.setExpression({ id:'c', latex: `c=${transform[1][0]}` });
    calculator.setExpression({ id:'d', latex: `d=${transform[1][1]}` });


  }, [transform]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', left: 1920/2-500, top: 240, width: 1000, height: 600 }}
    />
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
  const playCard = useUIStore((state) => state.playCard);

  const cardWidth = 200;
  const cardGap = 16;
  const totalWidth = hand.length * cardWidth + (hand.length - 1) * cardGap;
  const startX = (1920 - totalWidth) / 2;
  const startY = 900

  return (
    <>
      {hand.map((card, i) => {
        const x = startX + i * (cardWidth + cardGap);
        return (
          <div
            key={card.id}
            style={{ position: 'absolute', left: x, top: startY }}
            onDoubleClick={() => playCard(card.id)}
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