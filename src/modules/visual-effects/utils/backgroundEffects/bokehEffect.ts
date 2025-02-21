import type { EffectContext } from './types';
import type { BackgroundEffect } from '../../model/types';

export const applyBokehEffect = (
  ctx: CanvasRenderingContext2D,
  { video, maskData, width, height }: EffectContext,
  effect: Extract<BackgroundEffect, { type: 'bokeh' }>
) => {
  // Создаем canvas для размытого фона
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext('2d');
  if (!blurCtx) return;

  // Рисуем видео на canvas для размытия
  blurCtx.drawImage(video, 0, 0, width, height);
  
  // Применяем размытие
  blurCtx.filter = `blur(${effect.backgroundBlurAmount}px)`;
  blurCtx.drawImage(blurCanvas, 0, 0);
  
  // Получаем данные размытого изображения
  const blurredData = blurCtx.getImageData(0, 0, width, height);
  const blurredPixels = blurredData.data;

  // Получаем данные оригинального изображения
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(video, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Комбинируем оригинальное изображение с размытым фоном
  for (let i = 0; i < maskData.data.length; i += 4) {
    if (maskData.data[i] === 0) {
      pixels[i] = blurredPixels[i];         // R
      pixels[i + 1] = blurredPixels[i + 1]; // G
      pixels[i + 2] = blurredPixels[i + 2]; // B
      pixels[i + 3] = 255;                  // A
    }
  }

  // Отрисовываем результат
  ctx.putImageData(imageData, 0, 0);
}; 