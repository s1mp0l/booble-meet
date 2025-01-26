import { createContext, useContext, useEffect } from 'react';
import { ItemDimensions } from '../types/grid.ts';
import { LayoutType } from '../model/constants.ts';

const DEFAULT_DIMENSIONS: ItemDimensions = {
  width: 320,
  height: 240
};

interface VideoGridContextValue {
  registerItem: () => void;
  unregisterItem: () => void;
  getItemSize: (isFirst: boolean) => ItemDimensions;
  layoutType: LayoutType;
}

export const VideoGridContext = createContext<VideoGridContextValue | null>(null);

export const useVideoGridContext = () => {
  const context = useContext(VideoGridContext);
  if (!context) {
    throw new Error('useVideoGridContext must be used within a VideoGridProvider');
  }
  return context;
};

export const useVideoGridItemSize = (isFirst: boolean = false): ItemDimensions => {
  const context = useVideoGridContext();
  
  useEffect(() => {
    context.registerItem();
    return () => {
      context.unregisterItem();
    };
  }, [context]);

  try {
    return context.getItemSize(isFirst);
  } catch (error) {
    console.warn('Failed to get item size from context, using default dimensions', error);
    return DEFAULT_DIMENSIONS;
  }
}; 