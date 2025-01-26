import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import * as tf from '@tensorflow/tfjs-core';
import type { BackgroundEffect } from '../model/types';
export type { BackgroundEffect };

export const initializeTensorFlow = async () => {
  await tf.ready();
  await tf.setBackend('webgl');
};

export const createBodyPixSegmenter = async () => {
  return await bodySegmentation.createSegmenter(
    bodySegmentation.SupportedModels.BodyPix,
    {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    }
  );
};

export const segmentPeople = async (video: HTMLVideoElement, segmenter: bodySegmentation.BodySegmenter) => {
  return await segmenter.segmentPeople(video, {
    flipHorizontal: true,
    internalResolution: 'medium',
    segmentationThreshold: 0.7
  });
};

export const applyBackgroundEffect = async (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  segmentation: Awaited<ReturnType<typeof segmentPeople>>[0],
  effect: BackgroundEffect
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Установка размеров canvas равными размерам видео
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (effect.type === 'none') {
    // Ничего не делаем, оставляем canvas прозрачным
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  if (effect.type === 'color') {
    // Создаем бинарную маску для человека
    const binaryMask = await bodySegmentation.toBinaryMask(
      segmentation,
      { r: 0, g: 0, b: 0, a: 0 }, // цвет человека
      effect.color // цвет фона
    );

    // Отрисовка человека поверх фона
    await bodySegmentation.drawMask(
      canvas,
      video,
      binaryMask,
      1, // opacity
      5, // maskBlurAmount
      false // flipHorizontal
    );
  } else {
    // Применяем эффект боке
    await bodySegmentation.drawBokehEffect(
      canvas,
      video,
      segmentation,
      0.5,
      effect.backgroundBlurAmount,
      3,
      false // flipHorizontal
    );
  }
}; 