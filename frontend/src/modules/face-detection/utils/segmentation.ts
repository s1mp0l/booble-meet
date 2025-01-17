import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import * as tf from '@tensorflow/tfjs-core';

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

export const applyBokehEffect = async (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  segmentation: bodySegmentation.SemanticPersonSegmentation,
  {
    foregroundThreshold = 0.6,
    backgroundBlurAmount = 10,
    edgeBlurAmount = 5,
    flipHorizontal = false
  } = {}
) => {
  await bodySegmentation.drawBokehEffect(
    canvas,
    video,
    segmentation,
    foregroundThreshold,
    backgroundBlurAmount,
    edgeBlurAmount,
    flipHorizontal
  );
}; 