import type { Card } from "../components/Card";
import { create } from 'zustand';
import { numericCard } from "../components/Card";
import { TASK_LIST } from "../data/tasks";

// State for 
interface GameState {
  // Current scene
  currentTask: number,
  setCurrentTask: (task: number) => void,
  seed: number,
  newSeed: () => void,
  // Matrix library
  matrixLibary: Card[],
  // Puzzles solved
  taskCompletion: Record<number, number>,
  tasksUnlocked: Record<number, boolean>,
  // On the right side of the = 
  targetCard : Card,
  setTargetCard: (card:Card) => void;
  // Matrices that are always applied to the left hand side of the equation
  fixedLHS : Card[], 
  setFixedLHS: (cards: Card[]) => void;
}

const defaultTaskCompletion = (): Record<number, number> =>
  Object.fromEntries(TASK_LIST.map((_, i) => [i, 0]));

const defaultTasksUnlocked = (): Record<number, boolean> =>
  Object.fromEntries(TASK_LIST.map((_, i) => [i, i === 0]));

export const useGameState = create<GameState>((set) => ({
  targetCard: numericCard([[1, 0], [0, 1]], 'Identity'),
  setTargetCard: (card:Card) => set({targetCard: card}),
  fixedLHS : [],
  setFixedLHS: (cards) => set({fixedLHS: cards}),
  taskCompletion: defaultTaskCompletion(),
  matrixLibary: [],
  tasksUnlocked: defaultTasksUnlocked(),
  currentTask: 0,
  setCurrentTask: (task: number) => set({currentTask:task}),
  seed: 0,
  newSeed: () => set({seed: Math.random()})
}));
