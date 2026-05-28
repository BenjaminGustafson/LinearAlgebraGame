import { type Card } from "../../types/Card";
import { type StateCreator } from "zustand";
import { type StackSlice } from './StackSlice';
import { immer } from 'zustand/middleware/immer'; // do not delete this import

export type HandSlice = {
  hand: Card[];
  addCardToHand: (card: Card) => void;
  reorderHand: (from: number, to: number) => void;
  playCard: (i: number) => void;   // hand -> stack
}


export const createHandSlice: StateCreator <
  HandSlice & StackSlice,
  [['zustand/immer', never]],
  [],
  HandSlice
> = (set) => ({
  hand: [],
  addCardToHand: (card) => set((state) => {
    state.hand.push(card);
  }),
  reorderHand: (from: number, to: number) => set(state => {
    if (from === to) return;
    const [moved] = state.hand.splice(from, 1);
    state.hand.splice(to, 0, moved);
  }),
  playCard: (i) => set((state) => {
    const card = state.hand[i];
    if (!card) {
      console.warn('Invalid index in hand ', i)
      return
    };
    state.matrixStack.push(card);
    state.hand.splice(i, 1);
  }),
});

