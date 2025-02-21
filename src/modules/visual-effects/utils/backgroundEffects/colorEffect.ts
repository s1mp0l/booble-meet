import type { EffectContext } from './types';
import type { BackgroundEffect } from '../../model/types';

export const applyColorEffect = (
  ctx: CanvasRenderingContext2D,
  { video, maskData, width, height }: EffectContext,
  effect: Extract<BackgroundEffect, { type: 'color' }>
) => {
  // Сначала рисуем цветной фон
  ctx.fillStyle = `rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${effect.color.a / 255})`;
  ctx.fillRect(0, 0, width, height);

  // Создаем временный canvas для маскированного видео
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Рисуем видео на временный canvas
  tempCtx.drawImage(video, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Применяем маску к видео (делаем прозрачным фон)
  for (let i = 0; i < maskData.data.length; i += 4) {
    const isMask = maskData.data[i] > 0;
    if (!isMask) {
      pixels[i + 3] = 0; // Делаем фон прозрачным
    }
  }

  // Отрисовываем маскированное видео поверх цветного фона
  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);
}; 