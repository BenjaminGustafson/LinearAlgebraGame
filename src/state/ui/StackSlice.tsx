import { type Card } from "../../types/Card";
import { type StateCreator } from "zustand";
import { numericCard } from '../../types/Card';
import { immer } from 'zustand/middleware/immer'; // do not delete this import
import { type HandSlice } from "./HandSlice";
import { type EntitySlice } from "./EntitySlice";

export type StackSlice = {
  matrixStack: Card[];
  addCardToStack: (card: Card) => void;
  removeCardFromStack: (card: Card) => void;
  popStack: () => void;
  stackProduct: Card;
  setStackProduct: (card: Card) => void;
}

const createIdentityCard = () => numericCard([[1,0],[0,1]], 'Identity')


export const createStackSlice: StateCreator <
  HandSlice & StackSlice & EntitySlice,
  [['zustand/immer', never]],
  [],
  StackSlice
> = (set) => ({
  matrixStack: [],
  addCardToStack: (card) => set((state) => {
    if (state.matrixStack.findIndex(c => c.id === card.id) !== -1) {
      console.warn('card already on stack')
      return
    }
    state.matrixStack.push(card);
  }),
  popStack: () => set((state) => {
    if (state.matrixStack.length === 0) return;
    const card = state.matrixStack.pop()!;
    state.hand.push(card);
  }),
  removeCardFromStack: (card) => set((state) => {
    const i = state.matrixStack.findIndex(c => c.id === card.id);
    if (i === -1) {
      console.warn('Card not found in stack', card.id);
      return;
    }
    state.matrixStack.splice(i, 1);
  }),
  setStackProduct: (card) => set((state) => {
    state.stackProduct = card;
  }),
  stackProduct: createIdentityCard(),
});
