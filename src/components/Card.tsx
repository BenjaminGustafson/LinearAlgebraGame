import type { Mat2 } from '../types/Matrix.tsx'


export interface Card {
    id: string;
    matrix: Mat2;
    //matrix: string[];
}

/**
 * 
 * A card should have the four numbers of the matrix drawn in a grid
 * And be a square div
 * Later: dnd-kit
 */
export function CardComponent({ card }: { card: Card }) {
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

