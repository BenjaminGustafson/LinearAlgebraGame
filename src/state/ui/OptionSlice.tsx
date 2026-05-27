import { type StateCreator } from "zustand";
import { immer } from 'zustand/middleware/immer'; // do not delete this import


/**
 * 
 */
export type OptionSlice = {
  simplifyExpressions: boolean;
  toggleSimplify: () => void;
  substituteVariables: boolean; 
  toggleVariables: () => void;
  showResultNotTarget: boolean;
  toggleResultTarget: () => void;
  taskMenuOpen: boolean;
  toggleTaskMenu: () => void;
}


export const createOptionSlice: StateCreator <
  OptionSlice,
  [['zustand/immer', never]],
  [],
  OptionSlice
> = (set) => ({
  simplifyExpressions: false,
  toggleSimplify: () => set((state) => { state.simplifyExpressions = !state.simplifyExpressions; }),
  substituteVariables: false,
  toggleVariables: () => set((state) => { state.substituteVariables = !state.substituteVariables; }),
  showResultNotTarget: true,
  toggleResultTarget: () => set((state) => { state.showResultNotTarget = !state.showResultNotTarget; }),
  taskMenuOpen: false,
  toggleTaskMenu: () => set((state) => { state.taskMenuOpen = !state.taskMenuOpen; }),
});

