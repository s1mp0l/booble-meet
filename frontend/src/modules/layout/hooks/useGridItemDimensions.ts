import {useMemo} from 'react';
import {
  ASPECT_RATIO,
  BOTTOM_MENU_HEIGHT,
  CONTAINER_PADDINGS,
  GAP,
  HEADER_MENU_HEIGHT,
  LayoutType,
  MAX_CARD_WIDTH,
  MIN_CARD_WIDTH
} from '../model/constants.ts';
import {useWindowSize} from './useWindowSize.ts';
import {GridLayout} from '../types/grid.ts';

interface UseGridItemDimensionsProps {
  itemCount: number;
  layoutType: LayoutType;
}

const calculateAspectRatioFit = (
  containerWidth: number,
  containerHeight: number,
  targetRatio: number
) => {
  const containerRatio = containerWidth / containerHeight;
  
  if (containerRatio > targetRatio) {
    // Контейнер шире - начинаем с высоты
    const height = Math.floor(containerHeight);
    const width = Math.floor(height * targetRatio);
    return {width, height};
  } else {
    // Контейнер уже - начинаем с ширины
    const width = Math.floor(containerWidth);
    const height = Math.floor(width / targetRatio);
    return {width, height};
  }
};

export const useGridItemDimensions = ({
  itemCount,
  layoutType
}: UseGridItemDimensionsProps): GridLayout => {
  const {width: windowWidth, height: windowHeight} = useWindowSize();

  return useMemo(() => {
    // Убеждаемся, что у нас есть хотя бы один элемент
    const safeItemCount = Math.max(itemCount, 1);

    // Вычисляем доступное пространство с учетом меню и отступов
    const availableWidth = Math.floor(windowWidth - (CONTAINER_PADDINGS * 2));
    const availableHeight = Math.floor(windowHeight - HEADER_MENU_HEIGHT - BOTTOM_MENU_HEIGHT - (CONTAINER_PADDINGS * 2));

    if (layoutType === LayoutType.SPOTLIGHT && safeItemCount > 1) {
      // Для лейаута с одним большим элементом
      const spotlightContainerWidth = Math.floor(Math.min((availableWidth - GAP) * 0.7, MAX_CARD_WIDTH));
      const spotlightContainerHeight = Math.floor(availableHeight - 2 * GAP);
      
      const spotlight = calculateAspectRatioFit(
        spotlightContainerWidth,
        spotlightContainerHeight,
        ASPECT_RATIO
      );

      const smallItemsContainerWidth = Math.floor(availableWidth - spotlight.width - 3 * GAP);
      const smallItemContainerHeight = Math.floor((availableHeight - ((safeItemCount - 2) * GAP)) / (safeItemCount - 1));
      
      const smallItem = calculateAspectRatioFit(
        smallItemsContainerWidth,
        smallItemContainerHeight,
        ASPECT_RATIO
      );

      return {
        items: [
          spotlight,
          ...Array(safeItemCount - 1).fill(smallItem)
        ],
        columns: 2,
        rows: safeItemCount - 1
      };
    } else {
      // Для сетки с одинаковыми элементами
      const maxColumns = Math.floor((availableWidth + GAP) / (MIN_CARD_WIDTH + GAP));
      const columns = Math.min(Math.ceil(Math.sqrt(safeItemCount)), maxColumns);
      const rows = Math.ceil(safeItemCount / columns);

      // Вычисляем размеры контейнера для каждого элемента
      const itemContainerWidth = Math.floor((availableWidth - ((columns - 1) * GAP)) / columns);
      const itemContainerHeight = Math.floor((availableHeight - ((rows - 1) * GAP)) / rows);

      const item = calculateAspectRatioFit(
        itemContainerWidth,
        itemContainerHeight,
        ASPECT_RATIO
      );

      // Проверяем, не превышает ли ширина максимально допустимую
      if (item.width > MAX_CARD_WIDTH) {
        const maxItem = calculateAspectRatioFit(
          MAX_CARD_WIDTH,
          MAX_CARD_WIDTH / ASPECT_RATIO,
          ASPECT_RATIO
        );
        return {
          items: Array(safeItemCount).fill(maxItem),
          columns,
          rows
        };
      }

      return {
        items: Array(safeItemCount).fill(item),
        columns,
        rows
      };
    }
  }, [windowWidth, windowHeight, itemCount, layoutType]);
};