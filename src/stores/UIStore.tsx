import type { Card } from '../components/Card';
import { create } from 'zustand';
import {  useMemo } from 'react';
import type { Mat2 } from '../types/Matrix';
import { multiplyMat2, id2 } from '../types/Matrix';


// State for current UI
export interface UIStore {
  // Matrix stack
  matrixStack: Card[];
  addCardToStack: (card: Card) => void;
  popStack: () => void;
  // Matrix hand
  hand: Card[];
  addCardToHand: (card: Card) => void;
  playCard: (id: string) => void;   // hand -> stack
  returnCard: (id: string) => void; // stack -> hand
  // Panels
  matrixCreationPanel: boolean;
}

export const useUIStore = create<UIStore>((set) => ({
  hand: [],
  matrixStack: [],
  matrixCreationPanel: false,
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
export const useStackProduct = (): Mat2 => {
    const matrixStack = useUIStore((state) => state.matrixStack);
    return useMemo(
      () => matrixStack.reduce((acc, card) => multiplyMat2(acc, card.matrix), id2),
      [matrixStack]
    );
  };
  