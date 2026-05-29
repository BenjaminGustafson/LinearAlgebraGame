import { type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer'; // do not delete this import


export interface EntityRecord {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex?: number;
}

export interface EntitySlice {
  entities: Record<string, EntityRecord>;
  spawnEntity: (entity: EntityRecord) => void;
  despawnEntity: (id: string) => void;
  setPosition: (id: string, x: number, y: number) => void;
  setRotation: (id: string, rotation: number) => void;
  setEntityScale: (id: string, scale:number) => void;
  setZIndex: (id: string, z: number) => void;
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

  setZIndex: (id, z) => set((state) => {
    if (state.entities[id]) {
      state.entities[id].zIndex = z;
    }
  }),

  setEntityScale: (id, scale) => set((state) => {
    if (state.entities[id]) {
      state.entities[id].scale = scale;
    }
  }),

  resetEntities: () => set((state) => {
    state.entities = {};
  }),

  
});