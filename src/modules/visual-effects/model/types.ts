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
export type FaceMaskType = 'eyes' | 'glasses' | 'mustache' | 'none';

/**
 * Параметры для отрисовки маски
 */
export interface MaskDrawerOptions {
  smoothingFactor?: number;
  animationDuration?: number;
  scale?: number;
}

import { IColor } from '../../../shared/utils/graphics';

export type BackgroundEffect = {
  type: 'color';
  color: IColor;
} | {
  type: 'bokeh';
  backgroundBlurAmount: number;
} | {
  type: 'none';
};

export interface VisualEffectsState {
  backgroundEffect: BackgroundEffect;
  isFaceMeshEnabled: boolean;
} 