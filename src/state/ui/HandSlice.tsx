import { type Card } from "../../types/Card";
import { type StateCreator } from "zustand";
import { type StackSlice } from './StackSlice';
import { immer } from 'zustand/middleware/immer'; // do not delete this import


/**
 * Could combine this with stack slice to make card slice
 */
export type HandSlice = {
  hand: Card[];
  addCardToHand: (card: Card) => void;
  reorderHand: (from: number, to: number) => void;
  playCard: (card: Card) => void;   // hand -> stack
  insertCardToHand: (card: Card, i:number) => void;
  draggedCardId: string|null;
  setDraggedCardId: (id:string|null) => void;
  removeCardFromHand: (card: Card) => void;
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
  insertCardToHand: (card, i) => set((state) => {
    const oldI = state.hand.findIndex(c => c.id === card.id)
    if (oldI !== -1){
      state.hand.splice(oldI, 1);
    }
    state.hand.splice(i, 0, card);
  }),
  reorderHand: (from: number, to: number) => set(state => {
    if (from === to) return;
    const [moved] = state.hand.splice(from, 1);
    state.hand.splice(to, 0, moved);
  }),
  removeCardFromHand: (card) => set((state) => {
    const i = state.hand.findIndex(c => c.id === card.id);
    if (i === -1) {
      console.warn('Card not found in hand', card.id);
      return;
    }
    state.hand.splice(i, 1);
  }),
  playCard: (card) => set((state) => {
    const i = state.hand.findIndex(c => c.id === card.id);
    if (i === -1) {
      console.warn('Card not found in hand', card.id);
      return;
    }
    state.hand.splice(i, 1);
    state.matrixStack.push(card);
  }),
  draggedCardId: null,
  setDraggedCardId: (id) => set(state => {
    state.draggedCardId = id
  })
});

