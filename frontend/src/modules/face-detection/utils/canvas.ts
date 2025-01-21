/**
 * Рисует повернутое изображение с центром в заданной точке
 */
export const drawRotatedImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  angle: number,
  height?: number // Опциональная высота, если нужны разные размеры
) => {
  ctx.save();
  
  // Перемещаем контекст в центр изображения
  ctx.translate(x, y);
  
  // Вращаем вокруг центра
  ctx.rotate(angle);
  
  // Рисуем изображение с центром в точке вращения
  const halfWidth = width / 2;
  const halfHeight = (height ?? width) / 2;
  ctx.drawImage(
    img,
    -halfWidth,
    -halfHeight,
    width,
    height ?? width
  );
  
  ctx.restore();
}; 