import {createContext, useContext} from 'react';
import {ItemDimensions} from '../types/grid.ts';

interface VideoGridContextValue {
  items: ItemDimensions[];
  columns: number;
  rows: number;
  layoutType: 'spotlight' | 'grid';
}

export const VideoGridContext = createContext<VideoGridContextValue | null>(null);

export const useVideoGridContext = () => {
  const context = useContext(VideoGridContext);
  if (!context) {
    throw new Error('useVideoGridContext must be used within a VideoGridProvider');
  }
  return context;
};

export const useVideoGridItemSize = (index: number): ItemDimensions => {
  const {items} = useVideoGridContext();
  if (!items[index]) {
    throw new Error(`No item found at index ${index}`);
  }
  return items[index];
}; 