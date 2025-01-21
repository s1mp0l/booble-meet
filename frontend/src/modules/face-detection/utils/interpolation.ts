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
    x: lerp(prev.x, current.x, smoothingFactor),
    y: lerp(prev.y, current.y, smoothingFactor)
  };
};

export const smoothRotation = (
  currentAngle: number,
  previousAngle: number | null,
  smoothingFactor: number
): number => {
  if (previousAngle === null) {
    return currentAngle;
  }

  // Нормализуем разницу углов в диапазон [-π, π]
  let angleDiff = currentAngle - previousAngle;
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

  // Применяем сглаживание к разнице углов
  const smoothedDiff = lerp(0, angleDiff, smoothingFactor);
  
  return previousAngle + smoothedDiff;
};

/**
 * Плавная интерполяция размера
 * @param currentScale Текущий размер
 * @param previousScale Предыдущий размер
 * @param smoothingFactor Коэффициент сглаживания (0-1)
 */
export const smoothScale = (
  currentScale: number,
  previousScale: number | null,
  smoothingFactor: number
): number => {
  if (previousScale === null) {
    return currentScale;
  }

  return lerp(previousScale, currentScale, smoothingFactor);
}; 