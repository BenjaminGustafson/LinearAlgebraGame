import type { Mat2 } from '../math/Matrix.tsx'
import { useEffect, useRef } from 'react';
import { mathQuillPromise } from '../external/MathQuillLoader';
import { useUIState } from '../stores/UIState.tsx';
import { ComputeEngine } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

export interface Card {
  expressionMatrix: string[][];
  simplifiedMatrix: string[][];
  // substituted?
  matrix: Mat2;
  name: string,
}

export function numericCard(values: number[][], name:string = "") : Card {
  const stringMat = values.map(row => row.map(String));
  return {
    expressionMatrix: stringMat,
    simplifiedMatrix: stringMat,
    matrix: values as Mat2,
    name,
  }
}

/**
 * Create a card from an expression KNOWN TO BE VALID AND SIMPLIFIED
 */
export function cardFromSimplified(expressions: string[][]): Card{

  return {
    expressionMatrix: expressions,
    simplifiedMatrix: expressions,
    matrix: expressions.map(row => row.map(e => ce.parse(e).numericValue)) as Mat2,
  }
}


function StaticMath({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
      mathQuillPromise.then((MQ) => {
          if (ref.current) MQ.StaticMath(ref.current).latex(latex);
      });
  }, [latex]);

  return <span ref={ref} />;
}

/**
 * 
 * A card should have the four numbers of the matrix drawn in a grid
 * And be a square div
 * Later: dnd-kit
 */
export function CardComponent({ card, hidden = false, fixed = false, color='#1e293b' }: { 
  card: Card, hidden:boolean, fixed:boolean, color:string
 }) {
  const simplifyExpressions = useUIState(state => state.simplifyExpressions)
  const [[a, b], [c, d]] = simplifyExpressions ? card.simplifiedMatrix : card.expressionMatrix;

  return (
    <div style={{
      width: 200,
      height: 200,
      border: '1px solid #334155',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      overflow: 'hidden',
      backgroundColor: color, 
  }}
  className={`hover:bg-[#09121f] ${fixed ? "pointer-events-none" : ""}`}>
    <span style={{ textAlign: 'center',  overflow: 'hidden', color: 'white', fontSize: 'clamp(10px, 3vw, 28px)' }}><StaticMath latex={`\\text{${card.name ? card.name : ''}}`} /></span>

      <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 24px',
          fontWeight: 500,
          color: 'white',
          width: '180px',
          overflow: 'hidden',
      }}>
          <span style={{ textAlign: 'right', overflow: 'hidden', fontSize: 'clamp(10px, 3vw, 28px)' }}><StaticMath latex={a} /></span>
          <span style={{ textAlign: 'left',  overflow: 'hidden', fontSize: 'clamp(10px, 3vw, 28px)' }}><StaticMath latex={b} /></span>
          <span style={{ textAlign: 'right', overflow: 'hidden', fontSize: 'clamp(10px, 3vw, 28px)' }}><StaticMath latex={c} /></span>
          <span style={{ textAlign: 'left',  overflow: 'hidden', fontSize: 'clamp(10px, 3vw, 28px)' }}><StaticMath latex={d} /></span>
      </div>
  </div>
  );
}

