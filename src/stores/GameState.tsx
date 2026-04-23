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
  // Matrices that are always applied
  fixedStack : Card[], 
}
  

export const useGameState = create<GameState>((set) => ({
  targetCard: numericCard([[1, 0], [0, 1]]),
  fixedStack : [], 
}));
