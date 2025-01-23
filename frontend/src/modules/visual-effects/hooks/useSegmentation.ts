import {RefObject, useCallback, useRef} from 'react';
import {applyBackgroundEffect, BackgroundEffect} from '../utils/segmentation.ts';
import {useSegmenter} from './useSegmenter.ts';
import {useFrameRate} from './useFrameRate.ts';
import {useAnimationFrame} from './useAnimationFrame.ts';

interface UseSegmentationProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  fps?: number;
  effect: BackgroundEffect;
}

export const useSegmentation = ({
  videoRef, 
  canvasRef, 
  fps = 30,
  effect
}: UseSegmentationProps) => {
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
      const segmentation = await segmenter.segmentPeople(videoRef.current, {
        flipHorizontal: true,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });

      if (!segmentation || segmentation.length === 0) {
        isProcessingRef.current = false;
        return;
      }

      await applyBackgroundEffect(
        canvasRef.current, 
        videoRef.current, 
        segmentation[0],
        effect
      );
      isProcessingRef.current = false;
    } catch (err) {
      console.error('Ошибка сегментации:', err);
      isProcessingRef.current = false;
    }
  }, [videoRef, canvasRef, segmenter, isModelLoaded, shouldProcessFrame, effect]);

  useAnimationFrame(processFrame);

  return {
    isModelLoaded,
    error
  };
}; 