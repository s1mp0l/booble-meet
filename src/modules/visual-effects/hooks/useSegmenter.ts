import {useEffect, useState} from 'react';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import {createBodyPixSegmenter, initializeTensorFlow} from '../utils/segmentation.ts';

export const useSegmenter = () => {
  const [segmenter, setSegmenter] = useState<bodySegmentation.BodySegmenter | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeTensorFlow();
        const newSegmenter = await createBodyPixSegmenter();
        setSegmenter(newSegmenter);
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Ошибка инициализации сегментера:', err);
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка'));
        setIsModelLoaded(false);
      }
    };

    initialize();

    return () => {
      setSegmenter(null);
      setIsModelLoaded(false);
    };
  }, []);

  return {
    segmenter,
    isModelLoaded,
    error
  };
}; 