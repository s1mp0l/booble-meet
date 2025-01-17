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

// Округляем до ближайшего четного числа
const roundToEven = (num: number): number => {
  return Math.round(num / 2) * 2;
};

const calculateAspectRatioFit = (
  containerWidth: number,
  containerHeight: number,
  targetRatio: number
) => {
  const containerRatio = containerWidth / containerHeight;
  
  if (containerRatio > targetRatio) {
    // Контейнер шире - начинаем с высоты
    const height = roundToEven(containerHeight);
    const width = roundToEven(height * targetRatio);
    return {width, height};
  } else {
    // Контейнер уже - начинаем с ширины
    const width = roundToEven(containerWidth);
    const height = roundToEven(width / targetRatio);
    return {width, height};
  }
};

export const useGridItemDimensions = ({
  itemCount,
  layoutType
}: UseGridItemDimensionsProps): GridLayout => {
  const {width: windowWidth, height: windowHeight} = useWindowSize();

  return useMemo(() => {
    // Вычисляем доступное пространство с учетом меню и отступов
    const availableWidth = windowWidth - (CONTAINER_PADDINGS * 2);
    const availableHeight = windowHeight - HEADER_MENU_HEIGHT - BOTTOM_MENU_HEIGHT - (CONTAINER_PADDINGS * 2);

    if (layoutType === LayoutType.SPOTLIGHT && itemCount > 1) {
      // Для лейаута с одним большим элементом
      const spotlightContainerWidth = Math.min((availableWidth - GAP) * 0.7, MAX_CARD_WIDTH);
      const spotlightContainerHeight = availableHeight - 2 * GAP;
      
      const spotlight = calculateAspectRatioFit(
        spotlightContainerWidth,
        spotlightContainerHeight,
        ASPECT_RATIO
      );

      const smallItemsContainerWidth = availableWidth - spotlight.width - 3 * GAP;
      const smallItemContainerHeight = (availableHeight - ((itemCount - 2) * GAP)) / (itemCount - 1);
      
      const smallItem = calculateAspectRatioFit(
        smallItemsContainerWidth,
        smallItemContainerHeight,
        ASPECT_RATIO
      );

      return {
        items: [
          spotlight,
          ...Array(itemCount - 1).fill(smallItem)
        ],
        columns: 2,
        rows: itemCount - 1
      };
    } else {
      // Для сетки с одинаковыми элементами
      const maxColumns = Math.floor((availableWidth + GAP) / (MIN_CARD_WIDTH + GAP));
      const columns = Math.min(Math.ceil(Math.sqrt(itemCount)), maxColumns);
      const rows = Math.ceil(itemCount / columns);

      // Вычисляем размеры контейнера для каждого элемента
      const itemContainerWidth = (availableWidth - ((columns - 1) * GAP)) / columns;
      const itemContainerHeight = (availableHeight - ((rows - 1) * GAP)) / rows;

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
          items: Array(itemCount).fill(maxItem),
          columns,
          rows
        };
      }

      return {
        items: Array(itemCount).fill(item),
        columns,
        rows
      };
    }
  }, [windowWidth, windowHeight, itemCount, layoutType]);
};