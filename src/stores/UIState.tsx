import type { Card } from '../components/Card';
import { create } from 'zustand';
import {  useMemo } from 'react';
import type { Mat2 } from '../types/Matrix';
import { multiplyMat2, id2 } from '../types/Matrix';


// State for current UI
export interface UIState {
  // Matrix stack
  matrixStack: Card[];
  addCardToStack: (card: Card) => void;
  popStack: () => void;
  // Matrix hand
  hand: Card[];
  addCardToHand: (card: Card) => void;
  playCard: (i: number) => void;   // hand -> stack
  // Panels
  matrixBuilderPanel: boolean;
  toggleMatrixBuilder: () => void;
}

export const useUIState = create<UIState>((set) => ({
  hand: [],
  matrixStack: [],
  matrixBuilderPanel: false,
  toggleMatrixBuilder: () => set((state) => ({matrixBuilderPanel: !state.matrixBuilderPanel})),
  addCardToHand: (card) => set((state) => ({ hand: [...state.hand, card] })),
  addCardToStack: (card) => set((state) => ({ matrixStack: [...state.matrixStack, card] })),
  playCard: (i) => set((state) => {
    const card = state.hand[i];
    if (!card) return state;
    return {
      hand: state.hand.filter((_, j) => i !== j),
      matrixStack: [...state.matrixStack, card],
    };
  }),
  popStack: () => set((state) => {
    if (state.matrixStack.length == 0){
      return {}
    }
    const card = state.matrixStack[state.matrixStack.length-1]
    return {
      matrixStack: state.matrixStack.slice(0,-1),
      hand: [...state.hand, card],
    }
  })
}));

/**
 * Multiply the matrix stack
 * Multiplies from left to right (stack is rendered in opposite direction)
 * If stack is empty return identity
 */
export const useStackProduct = (): Mat2 => {
  const matrixStack = useUIState((state) => state.matrixStack);
  return useMemo(
    () => matrixStack.reduce((acc, card) => multiplyMat2(acc, card.matrix), id2),
    [matrixStack]
  );
};
