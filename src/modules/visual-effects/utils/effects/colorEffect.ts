import type { EffectContext } from './types';
import type { BackgroundEffect } from '../../model/types';

export const applyColorEffect = (
  ctx: CanvasRenderingContext2D,
  { video, maskData, width, height }: EffectContext,
  effect: Extract<BackgroundEffect, { type: 'color' }>
) => {
  // Создаем временный canvas для получения данных изображения
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Получаем данные изображения с видео через временный canvas
  tempCtx.drawImage(video, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Применяем цветной фон
  for (let i = 0; i < maskData.data.length; i += 4) {
    if (maskData.data[i] === 0) {
      pixels[i] = effect.color.r;     // R
      pixels[i + 1] = effect.color.g; // G
      pixels[i + 2] = effect.color.b; // B
      pixels[i + 3] = effect.color.a * 255; // A
    }
  }

  // Отрисовываем результат
  ctx.putImageData(imageData, 0, 0);
}; 