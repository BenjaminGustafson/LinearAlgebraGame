import { useShallow } from 'zustand/react/shallow'
import type { UseBoundStore, StoreApi } from 'zustand'

/**
 * Reduces boilerplate of getting stuff from stores
 * Usage for Zustand store useMyStore:
 * const myStore = usePick(useMyState, ['thingYouWant1', 'thingYouWant2'])
 */
export const usePick = <T, K extends keyof T>(store: UseBoundStore<StoreApi<T>>, keys: K[]) =>
  store(useShallow((state) => Object.fromEntries(keys.map(k => [k, state[k]])) as Pick<T, K>));