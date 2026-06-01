import { type Card } from "../../types/Card";
import { type StateCreator } from "zustand";
import { type StackSlice } from './StackSlice';
import { immer } from 'zustand/middleware/immer'; // do not delete this import


export type DropZone = 'stack' | 'hand';

export type DragAndDropSlice = {
  hoveredCardId: string|null;
  setHoveredCardId: (id:string|null, hovered:boolean) => void;
  draggedCardId: string|null;
  setDraggedCardId: (id:string|null) => void;
  dropZone: DropZone|null;
  setDropZone: (zone: DropZone) => void;
}


export const createDragAndDropSlice: StateCreator <
DragAndDropSlice,
  [['zustand/immer', never]],
  [],
DragAndDropSlice
> = (set) => ({
  hoveredCardId: null,
  setHoveredCardId: (id, hovered) => set(state => {
    // The hovered boolean parameter ensures that a card leaving hover
    // does not set hoveredCardId to null when there is already a new hovered card

    // If the card calling the function is the current hover AND it requests to leave hover
    // set current hover to null
    if (state.hoveredCardId == id && !hovered){
      state.hoveredCardId = null
    }
    // If the card is not the current hover AND it requests to be the hover
    // set it to be the current hover
    else if (state.hoveredCardId != id && hovered){
      state.hoveredCardId = id
    }
  }),
  draggedCardId: null,
  setDraggedCardId: (id) => set(state => {
    state.draggedCardId = id
  }),
  dropZone: null,
  setDropZone: (zone) => set(state => {
    state.dropZone = zone;
  }),
});

