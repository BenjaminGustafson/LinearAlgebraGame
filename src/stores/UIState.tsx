import type { Card } from '../components/Card';
import { cardFromSimplified, numericCard } from '../components/Card';
import { create } from 'zustand';
import { useMemo } from 'react';
import type { Mat2 } from '../math/Matrix';
import { multiplyMat2, id2 } from '../math/Matrix';
import { useGameState } from './GameState';
import { simplify } from '@cortex-js/compute-engine';
import { useEffect } from 'react';

// State for current UI
export interface UIState {
  // Matrix stack
  matrixStack: Card[];
  addCardToStack: (card: Card) => void;
  popStack: () => void;
  stackProduct: Card;
  setStackProduct: (card: Card) => void;
  // Matrix hand
  hand: Card[];
  addCardToHand: (card: Card) => void;
  playCard: (i: number) => void;   // hand -> stack
  // Panels
  matrixBuilderPanel: boolean;
  toggleMatrixBuilder: () => void;
  // Toggle options
  simplifyExpressions: boolean;
  toggleSimplify: () => void;
  substituteVariabless: boolean; // substitute variables
  toggleVariables: () => void;
  showResultNotTarget: boolean;
  toggleResultTarget: () => void;
  taskMenuOpen: boolean;
  toggleTaskMenu: () => void;
  resetUIForNewTask: () => void;
  taskSolved: boolean;
  setTaskSolved: (solved:boolean) => void;
}


const identityCard = numericCard([[1,0],[0,1]], 'Identity')

export const useUIState = create<UIState>((set) => ({
  
  hand: [],
  matrixStack: [],
  matrixBuilderPanel: false,
  toggleMatrixBuilder: () => set((state) => ({ matrixBuilderPanel: !state.matrixBuilderPanel })),
  addCardToHand: (card) => set((state) => ({ hand: [...state.hand, card] })),
  addCardToStack: (card) => set((state) => ({ matrixStack: [...state.matrixStack, card] })),
  stackProduct: identityCard,
  setStackProduct: (card: Card) => set({ stackProduct: card }),
  playCard: (i) => set((state) => {
    const card = state.hand[i];
    if (!card) return state;
    return {
      hand: state.hand.filter((_, j) => i !== j),
      matrixStack: [...state.matrixStack, card],
    };
  }),
  popStack: () => set((state) => {
    if (state.matrixStack.length == 0) {
      return {}
    }
    const card = state.matrixStack[state.matrixStack.length - 1]
    return {
      matrixStack: state.matrixStack.slice(0, -1),
      hand: [...state.hand, card],
    }
  }),
  simplifyExpressions: false,
  toggleSimplify: () => set((state) => ({ simplifyExpressions: !state.simplifyExpressions })),
  substituteVariabless: false,
  toggleVariables: () => set((state) => ({ substituteVariabless: !state.substituteVariabless })),
  showResultNotTarget: true,
  toggleResultTarget: () => set((state) => ({ showResultNotTarget: !state.showResultNotTarget })),
  taskMenuOpen: false,
  toggleTaskMenu: () => set((state) => ({ taskMenuOpen: !state.taskMenuOpen })),
  resetUIForNewTask: () => set((state) => {
    return {
      matrixStack: [],
      matrixBuilderPanel: false,
      hand: [],
      taskSolved: false,
    }
  }),
  taskSolved: false,
  setTaskSolved: (solved:boolean) => set(state => ({taskSolved: solved})), 
}));


export function multiplyExprMat2(a: string[][], b: string[][]): string[][] {
  return [
    [`(${a[0][0]})(${b[0][0]}) + (${a[0][1]})(${b[1][0]})`, `(${a[0][0]})(${b[0][1]}) + (${a[0][1]})(${b[1][1]})`],
    [`(${a[1][0]})(${b[0][0]}) + (${a[1][1]})(${b[1][0]})`, `(${a[1][0]})(${b[0][1]}) + (${a[1][1]})(${b[1][1]})`],
  ];
}

function simplifyMat2(m: string[][]): string[][] {
  return m.map(row => row.map(cell => simplify(cell).latex));
}

export function multiplyExprMat2Stack(matrices: string[][][]): string[][] {
  return matrices.reduce((acc, mat) =>
    simplifyMat2(multiplyExprMat2(acc, mat)),
    [['1', '0'], ['0', '1']]
  );
}

/**
 * Multiply the matrix stack
 * Multiplies from left to right (stack is rendered in opposite direction)
 * If stack is empty return identity
 */
export const useStackProduct = (): Card => {
  const matrixStack = useUIState((state) => state.matrixStack);
  const fixedLHS = useGameState(state => state.fixedLHS);
  const combinedStack = fixedLHS.concat(matrixStack);
  const setStackProduct = useUIState((state) => state.setStackProduct);

  const result = useMemo(
    () => cardFromSimplified(multiplyExprMat2Stack(combinedStack.map(card => card.simplifiedMatrix))),
    [matrixStack, fixedLHS]
  );

  useEffect(() => {
    setStackProduct(result);
  }, [result]);

  return result;
};
