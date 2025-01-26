import {RefObject, useCallback, useRef} from 'react';
import {applyBackgroundEffect, BackgroundEffect} from '../utils/segmentation.ts';
import {useSegmenter} from './useSegmenter.ts';

interface UseSegmentationProps {
  videoRef: RefObject<HTMLVideoElement>;
  effect: BackgroundEffect;
}

export const useSegmentation = ({
  videoRef,
  effect
}: UseSegmentationProps) => {
  const isProcessingRef = useRef(false);
  const {segmenter, isModelLoaded, error} = useSegmenter();

  const processSegmentation = useCallback(async (canvas: HTMLCanvasElement) => {
    if (!videoRef.current || !segmenter || !isModelLoaded || isProcessingRef.current) {
      return false;
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
        return false;
      }

      await applyBackgroundEffect(
        canvas,
        videoRef.current,
        segmentation[0],
        effect
      );

      isProcessingRef.current = false;
      return true;
    } catch (err) {
      console.error('Ошибка сегментации:', err);
      isProcessingRef.current = false;
      return false;
    }
  }, [videoRef, segmenter, isModelLoaded, effect]);

  return {
    processSegmentation,
    isModelLoaded,
    error
  };
}; 