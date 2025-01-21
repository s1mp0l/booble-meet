/**
 * Рисует повернутое изображение с центром в заданной точке
 */
export const drawRotatedImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  angle: number
) => {
  ctx.save();
  
  // Перемещаем контекст в центр изображения
  ctx.translate(x, y);
  
  // Вращаем вокруг центра
  ctx.rotate(angle);
  
  // Рисуем изображение с центром в точке вращения
  const halfSize = size / 2;
  ctx.drawImage(img, -halfSize, -halfSize, size, size);
  
  ctx.restore();
}; 