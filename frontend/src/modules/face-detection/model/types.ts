/**
 * Базовая точка с координатами x и y
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Тип маски для лица
 */
export type FaceMaskType = 'eyes' | 'glasses' | 'mustache';

/**
 * Параметры для отрисовки маски
 */
export interface MaskDrawerOptions {
  smoothingFactor?: number;
  animationDuration?: number;
  scale?: number;
} 