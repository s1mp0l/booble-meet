import {Point} from '../model/types';

/**
 * Линейная интерполяция между двумя значениями
 * @param start Начальное значение
 * @param end Конечное значение
 * @param t Коэффициент интерполяции (0-1)
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

/**
 * Плавная интерполяция между двумя точками
 * @param current Текущая точка
 * @param prev Предыдущая точка
 * @param smoothingFactor Коэффициент сглаживания (0-1)
 */
export const smoothPosition = (current: Point, prev: Point | null, smoothingFactor: number): Point => {
  if (!prev) return current;
  
  return {
    x: lerp(current.x, prev.x, smoothingFactor),
    y: lerp(current.y, prev.y, smoothingFactor)
  };
}; 