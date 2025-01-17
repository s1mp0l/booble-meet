import {CSSProperties, memo, ReactNode} from 'react';
import {useGridItemDimensions} from '../hooks/useGridItemDimensions.ts';
import {GAP, LayoutType} from '../model/constants.ts';
import {VideoGridContext} from '../context/VideoGridContext.ts';

interface VideoGridProps {
  children: ReactNode[];
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
  const {items, columns, rows} = useGridItemDimensions({
    itemCount: children.length,
    layoutType
  });

  return (
    <VideoGridContext.Provider
      value={{
        items,
        columns,
        rows,
        layoutType
      }}
    >
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: layoutType === LayoutType.SPOTLIGHT
            ? `${items[0].width}px 1fr`
            : `repeat(${columns}, 1fr)`,
          gap: GAP,
          ...style
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              width: items[index].width,
              height: items[index].height,
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#1a1a1a'
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </VideoGridContext.Provider>
  );
});

VideoGrid.displayName = 'VideoGrid'; 