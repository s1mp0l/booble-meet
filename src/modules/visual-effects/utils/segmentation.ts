import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import * as tf from '@tensorflow/tfjs-core';
import type { BackgroundEffect } from '../model/types';
import { applyColorEffect } from './backgroundEffects/colorEffect';
import { applyBokehEffect } from './backgroundEffects/bokehEffect';
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
  canvas.width = video.width;
  canvas.height = video.height;

  // Получаем данные маски сегментации
  const mask = segmentation.mask;
  const maskData = await mask.toImageData();

  const effectContext = {
    canvas,
    video,
    maskData,
    width: canvas.width,
    height: canvas.height
  };

  // Просто отрисовываем видео
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  switch (effect.type) {
    case 'color':
      applyColorEffect(ctx, effectContext, effect);
      break;
    case 'bokeh':
      applyBokehEffect(ctx, effectContext, effect);
      break;
    case 'none':
      break;
  }
}; 