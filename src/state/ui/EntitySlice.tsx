import { type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer'; // do not delete this import


export interface EntityRecord {
  id: string;
  x: number;
  y: number;
  rotation?:number;
  animation?: string;
}

export interface EntitySlice {
  entities: Record<string, EntityRecord>;
  spawnEntity: (entity: EntityRecord) => void;
  despawnEntity: (id: string) => void;
  setPosition: (id: string, x: number, y: number) => void;
  setRotation: (id: string, rotation: number) => void;
  setAnimation: (id: string, animation: string) => void;
  resetEntities: () => void;
}

export const createEntitySlice: StateCreator <
  EntitySlice,
  [['zustand/immer', never]],
  []
> = (set) => ({
  entities: {},

  spawnEntity: (entity) => set((state) => {
    state.entities[entity.id] = entity;
  }),

  despawnEntity: (id) => set((state) => {
    delete state.entities[id];
  }),

  setPosition: (id, x, y) => set((state) => {
    if (state.entities[id]) {
      state.entities[id].x = x;
      state.entities[id].y = y;
    }
  }),

  setRotation: (id, rotation) => set((state) => {
    if (state.entities[id]) {
      state.entities[id].rotation = rotation;
    }
  }),

  setAnimation: (id, animation) => set((state) => {
    if (state.entities[id]) {
      state.entities[id].animation = animation;
    }
  }),

  resetEntities: () => set((state) => {
    state.entities = {};
  }),
});