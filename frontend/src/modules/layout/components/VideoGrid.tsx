import {CSSProperties, memo, ReactNode, useState, useCallback} from 'react';
import {useGridItemDimensions} from '../hooks/useGridItemDimensions.ts';
import {GAP, LayoutType} from '../model/constants.ts';
import {VideoGridContext} from '../context/VideoGridContext.ts';
import {ItemDimensions} from '../types/grid.ts';

const DEFAULT_DIMENSIONS: ItemDimensions = {
  width: 320,
  height: 240
};

interface VideoGridProps {
  children: ReactNode | ReactNode[];
  layoutType?: LayoutType;
  className?: string;
  style?: CSSProperties;
}

export const VideoGrid = memo(({
  children,
  layoutType = LayoutType.GRID,
  className,
  style
}: VideoGridProps) => {
  // Храним количество элементов
  const [itemCount, setItemCount] = useState(0);

  // Регистрация элемента
  const registerItem = useCallback(() => {
    setItemCount(prev => prev + 1);
  }, []);

  // Удаление регистрации элемента
  const unregisterItem = useCallback(() => {
    setItemCount(prev => prev - 1);
  }, []);

  // Получаем размеры для текущего количества элементов
  const { items, columns } = useGridItemDimensions({
    itemCount: Math.max(itemCount, 1), // Минимум 1 элемент
    layoutType
  });

  // Получение размера для конкретного элемента
  const getItemSize = useCallback((isFirst: boolean): ItemDimensions => {
    if (!items.length) {
      return DEFAULT_DIMENSIONS;
    }

    // Для spotlight layout первый элемент больше остальных
    if (layoutType === LayoutType.SPOTLIGHT && itemCount > 1 && isFirst) {
      return items[0];
    }
    return items[layoutType === LayoutType.SPOTLIGHT && itemCount > 1 ? 1 : 0];
  }, [items, layoutType, itemCount]);

  return (
    <VideoGridContext.Provider
      value={{
        registerItem,
        unregisterItem,
        getItemSize,
        layoutType
      }}
    >
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: layoutType === LayoutType.SPOTLIGHT && itemCount > 1
            ? `${items[0]?.width || DEFAULT_DIMENSIONS.width}px 1fr`
            : `repeat(${columns}, 1fr)`,
          gap: GAP,
          ...style
        }}
      >
        {children}
      </div>
    </VideoGridContext.Provider>
  );
});

VideoGrid.displayName = 'VideoGrid'; 