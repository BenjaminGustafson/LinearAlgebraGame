import type { Card } from "../components/Card";
import { create } from 'zustand';
import { numericCard } from "../components/Card";

// State for 
interface GameState {
  // Current scene
  // Matrix library
  // Puzzles solved
  // On the right side of the = 
  targetCard : Card,
  // Matrices that are always applied to the left hand side of the equation
  fixedLHS : Card[], 
  setFixedLHS: (cards: Card[]) => void;
}
  

export const useGameState = create<GameState>((set) => ({
  targetCard: numericCard([[1, 0], [0, 1]]),
  fixedLHS : [],
  setFixedLHS: (cards) => set({fixedLHS: cards}),
}));
