import {createContext, useContext} from 'react';
import {ItemDimensions} from '../types/grid.ts';

interface VideoGridContextValue {
  items: ItemDimensions[];
  columns: number;
  rows: number;
  layoutType: 'spotlight' | 'grid';
  indexMap: Map<number, number>;
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
  const {items, indexMap} = useVideoGridContext();
  const validIndex = indexMap.get(index);
  
  if (validIndex === undefined || !items[validIndex]) {
    throw new Error(`No item found at index ${index}`);
  }
  
  return items[validIndex];
}; 