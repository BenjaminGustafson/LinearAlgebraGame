import { type StateCreator } from "zustand";
import { immer } from 'zustand/middleware/immer'; // do not delete this import


export type PanelSlice = {
  matrixBuilderPanel: boolean;
  toggleMatrixBuilder: () => void;
  taskMenuPanel: boolean;
  toggleTaskMenu: () => void;  
}

export const createPanelSlice: StateCreator <
  PanelSlice,
  [['zustand/immer', never]],
  [],
  PanelSlice
> = (set) => ({
  matrixBuilderPanel: false,
  toggleMatrixBuilder: () => set((state) => { state.matrixBuilderPanel = !state.matrixBuilderPanel; }),
  taskMenuPanel: false,
  toggleTaskMenu: () => set((state) => { state.taskMenuPanel = !state.taskMenuPanel; }),
});
