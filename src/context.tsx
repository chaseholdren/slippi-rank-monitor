import { createContext, useContext } from 'react';
import type { AppStore, AppStoreState } from './store';
import { useStore } from 'zustand';

export const AppContext = createContext<AppStore | null>(null);

export function useAppContext<T>(selector: (state: AppStoreState) => T): T {
  const store = useContext(AppContext);
  if (!store) throw new Error('Missing BearContext.Provider in the tree');
  return useStore(store, selector);
}
