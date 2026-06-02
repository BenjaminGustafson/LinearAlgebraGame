import type { Card } from '../../types/Card.tsx'
import { cardFromSimplified, numericCard } from '../../types/Card.tsx';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { useMemo, useEffect } from 'react';
import { simplify } from '@cortex-js/compute-engine';

import { createHandSlice, type HandSlice } from './HandSlice.tsx';
import { createStackSlice, type StackSlice } from './StackSlice.tsx';
import { createOptionSlice, type OptionSlice } from './OptionSlice.tsx';
import { createPanelSlice, type PanelSlice } from './PanelSlice.tsx';
import { createEntitySlice, type EntitySlice } from './EntitySlice.tsx';
import { createDragAndDropSlice, type DragAndDropSlice } from './DragAndDropSlice.tsx';

import { useGameState } from '../game/GameState.tsx';

/**
 * The state of the UI.
 */
export type UIState = HandSlice & StackSlice & OptionSlice & PanelSlice & EntitySlice & DragAndDropSlice & {
  scale: number;
  setScale: (scale: number) => void;  
  containerOffset: { x: number, y: number }
  setContainerOffset: (x: number, y: number) => void
  resetUIForNewTask: () => void;
  taskSolved: boolean;
  setTaskSolved: (solved:boolean) => void;
}


export const useUIState = create<UIState>()(
  immer((set, get, store) => ({
    ...createHandSlice(set as any, get, store as any),
    ...createStackSlice(set as any, get, store as any),
    ...createOptionSlice(set as any, get, store as any),
    ...createPanelSlice(set as any, get, store as any),
    ...createEntitySlice(set as any, get, store as any),
    ...createDragAndDropSlice(set as any, get, store as any),
    scale: 1,
    setScale: (scale) => set((state) => {
      state.scale = scale;
    }),
    containerOffset: {x: 0, y:0},
    setContainerOffset: (x, y) => set(state => {
      state.containerOffset = {x, y}
    }),
    resetUIForNewTask: () => set((state) => {
      state.matrixStack =  [];
      state.matrixBuilderPanel = false
      state.hand = [];
      state.taskSolved = false;
    }),
    taskSolved: false,
    setTaskSolved: (taskSolved:boolean) => set((state) => {
      state.taskSolved = taskSolved
    }), 
  }))
);


/**
 * Multiply the matrix stack
 * Multiplies from left to right (stack is rendered in opposite direction)
 * If stack is empty return identity
 */
export function getStackProduct(): Card {
  const matrixStack = useUIState.getState().matrixStack;
  const fixedLHS = useGameState.getState().fixedLHS;
  const combinedStack = fixedLHS.concat(matrixStack);
  return cardFromSimplified(multiplyExprMat2Stack(combinedStack.map(card => card.simplifiedMatrix)));
}

export const useStackProduct = (): Card => {
  const matrixStack = useUIState((state) => state.matrixStack);
  const fixedLHS = useGameState(state => state.fixedLHS);
  return useMemo(getStackProduct, [matrixStack, fixedLHS]);
}

// Helpers for useStackProduct vvv
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

  // const multiplied = matrices.reduce(((acc, mat) => 
  //   multiplyExprMat2(acc, mat)),
  //   [['1', '0'], ['0', '1']]
  // )
  // const simplify = simplifyMat2(multiplied)
  const multiplyAndSimplify = matrices.reduce(((acc, mat) => 
    simplifyMat2(multiplyExprMat2(acc, mat))),
    [['1', '0'], ['0', '1']]
  )
  return multiplyAndSimplify
}

// Helpers for useStackProduct ^^^