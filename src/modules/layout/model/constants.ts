export const ASPECT_RATIO = 4 / 3;
export const MIN_CARD_WIDTH = 320;
export const MAX_CARD_WIDTH = 600;

export const GAP = 8; // Отступ между карточками
export const BOTTOM_MENU_HEIGHT = 80;
export const HEADER_MENU_HEIGHT = 64;
export const CONTAINER_PADDINGS = 16;

// Максимальная ширина экрана для мобильных устройств
export const MOBILE_MAX_WIDTH = 768;
// Регулярное выражение для определения мобильных устройств
export const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export enum LayoutType {
  SPOTLIGHT = 'spotlight', // Один большой + остальные маленькие
  GRID = 'grid' // Все одинакового размера
}

export interface IWithIndex {
  index: number;
}

