import {RefObject, useCallback, useRef} from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {useFrameRate} from './useFrameRate.ts';
import {useAnimationFrame} from './useAnimationFrame.ts';
import eyeImage from '/assets/eye.png';

interface UseFaceDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  fps?: number;
}

export const useFaceDetection = ({
  videoRef,
  canvasRef,
  fps = 30
}: UseFaceDetectionProps) => {
  const isProcessingRef = useRef(false);
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const isInitializedRef = useRef(false);
  const eyeImageRef = useRef<HTMLImageElement | null>(null);
  const {shouldProcessFrame} = useFrameRate({fps});

  const initializeDetector = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      console.log('Initializing detector...');
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
      } as const;

      // Загружаем изображение глаза
      const img = new Image();
      img.src = eyeImage;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });
      eyeImageRef.current = img;

      detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
      isInitializedRef.current = true;
      console.log('Detector initialized successfully');
    } catch (err) {
      console.error('Error initializing detector:', err);
    }
  }, []);

  const drawEyeMask = useCallback((
    ctx: CanvasRenderingContext2D,
    keypoints: faceDetection.Keypoint[]
  ) => {
    if (!eyeImageRef.current) return;

    // Очищаем канвас
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Находим ключевые точки глаз
    const leftEye = keypoints.find(point => point.name === 'leftEye');
    const rightEye = keypoints.find(point => point.name === 'rightEye');

    if (leftEye && rightEye) {
      // Вычисляем размер глаза на основе расстояния между глазами
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
      );
      const eyeSize = eyeDistance * 0.5; // Размер изображения глаза

      // Рисуем левый глаз
      ctx.drawImage(
        eyeImageRef.current,
        leftEye.x - eyeSize / 2,
        leftEye.y - eyeSize / 2,
        eyeSize,
        eyeSize
      );

      // Рисуем правый глаз
      ctx.drawImage(
        eyeImageRef.current,
        rightEye.x - eyeSize / 2,
        rightEye.y - eyeSize / 2,
        eyeSize,
        eyeSize
      );
    }
  }, []);

  const processFrame = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !detectorRef.current ||
      !isInitializedRef.current ||
      !shouldProcessFrame(performance.now()) ||
      isProcessingRef.current ||
      videoRef.current.readyState !== 4
    ) {
      return;
    }

    isProcessingRef.current = true;

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current, {
        flipHorizontal: false
      });

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Если лицо обнаружено
      if (faces.length > 0) {
        const face = faces[0];
        if (face.keypoints) {
          drawEyeMask(ctx, face.keypoints);
        }
      } else {
        // Если лицо не обнаружено, очищаем канвас
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    } catch (err) {
      console.error('Ошибка при обработке кадра:', err);
    } finally {
      isProcessingRef.current = false;
    }
  }, [videoRef, canvasRef, shouldProcessFrame, drawEyeMask]);

  useAnimationFrame(processFrame);

  return {
    initializeDetector
  };
};