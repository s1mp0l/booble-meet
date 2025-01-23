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
  onFaceDetected?: (
    ctx: CanvasRenderingContext2D,
    keypoints: faceDetection.Keypoint[],
    face: faceDetection.Face
  ) => void;
}

export const useFaceDetection = ({
  videoRef,
  canvasRef,
  fps = 30,
  onFaceDetected
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

      // Очищаем канвас перед отрисовкой
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Если лицо обнаружено и есть callback для отрисовки
      if (faces.length > 0 && onFaceDetected) {
        const face = faces[0];
        if (face.keypoints) {
          onFaceDetected(ctx, face.keypoints, face);
        }
      }
    } catch (err) {
      console.error('Ошибка при обработке кадра:', err);
    } finally {
      isProcessingRef.current = false;
    }
  }, [videoRef, canvasRef, shouldProcessFrame, onFaceDetected]);

  useAnimationFrame(processFrame);

  return {
    initializeDetector
  };
};