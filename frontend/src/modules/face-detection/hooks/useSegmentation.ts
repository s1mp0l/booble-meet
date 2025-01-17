import {RefObject, useCallback, useRef} from 'react';
import {applyBokehEffect, segmentPeople} from '../utils/segmentation.ts';
import {useSegmenter} from './useSegmenter.ts';
import {useFrameRate} from './useFrameRate.ts';
import {useAnimationFrame} from './useAnimationFrame.ts';

interface UseSegmentationProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  fps?: number;
}

export const useSegmentation = ({videoRef, canvasRef, fps = 30}: UseSegmentationProps) => {
  const isProcessingRef = useRef(false);
  const {segmenter, isModelLoaded, error} = useSegmenter();
  const {shouldProcessFrame} = useFrameRate({fps});

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !segmenter || !isModelLoaded) {
      return;
    }

    if (!shouldProcessFrame(performance.now())) {
      return;
    }

    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      const segmentation = await segmentPeople(videoRef.current, segmenter);

      if (!segmentation || segmentation.length === 0) {
        isProcessingRef.current = false;
        return;
      }

      await applyBokehEffect(canvasRef.current, videoRef.current, segmentation[0]);
      isProcessingRef.current = false;
    } catch (err) {
      console.error('Ошибка сегментации:', err);
      isProcessingRef.current = false;
    }
  }, [videoRef, canvasRef, segmenter, isModelLoaded, shouldProcessFrame]);

  useAnimationFrame(processFrame);

  return {
    isModelLoaded,
    error
  };
}; 