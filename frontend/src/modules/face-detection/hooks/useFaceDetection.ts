import {RefObject, useCallback, useRef} from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {useFrameRate} from './useFrameRate.ts';
import {useAnimationFrame} from './useAnimationFrame.ts';

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

      detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
      isInitializedRef.current = true;
      console.log('Detector initialized successfully');
    } catch (err) {
      console.error('Error initializing detector:', err);
    }
  }, []);

  const drawFaceMesh = useCallback((
    ctx: CanvasRenderingContext2D,
    keypoints: faceDetection.Keypoint[]
  ) => {
    // Очищаем канвас
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Рисуем точки
    keypoints.forEach(keypoint => {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });
  }, []);

  const processFrame = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !detectorRef.current ||
      !isInitializedRef.current ||
      !shouldProcessFrame(performance.now()) ||
      isProcessingRef.current ||
      videoRef.current.readyState !== 4 // Ждем, пока видео будет готово
    ) {
      return;
    }

    isProcessingRef.current = true;

    try {
      console.log('Processing frame...');
      const faces = await detectorRef.current.estimateFaces(videoRef.current, {
        flipHorizontal: false
      });

      console.log('Faces detected:', faces.length);

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Если лицо обнаружено
      if (faces.length > 0) {
        const face = faces[0];
        if (face.keypoints) {
          console.log('Drawing face mesh with keypoints:', face.keypoints.length);
          drawFaceMesh(ctx, face.keypoints);
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
  }, [videoRef, canvasRef, shouldProcessFrame, drawFaceMesh]);

  useAnimationFrame(processFrame);

  return {
    initializeDetector
  };
}; 