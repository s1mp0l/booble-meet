/**
 * Возвращает угол поворота для анимации на основе времени
 * @param startTime Время начала анимации
 * @param duration Длительность одного оборота в миллисекундах
 */
export const getRotationAngle = (startTime: number, duration: number = 1000): number => {
  const elapsed = Date.now() - startTime;
  return (elapsed % duration) / duration * Math.PI * 2;
}; 