import {useRef} from 'react';

interface UseFrameRateProps {
  fps: number;
}

export const useFrameRate = ({fps}: UseFrameRateProps) => {
  const lastFrameTimeRef = useRef(0);
  const frameInterval = 1000 / fps;

  const shouldProcessFrame = (currentTime: number) => {
    const timeSinceLastFrame = currentTime - lastFrameTimeRef.current;
    if (timeSinceLastFrame < frameInterval) {
      return false;
    }
    lastFrameTimeRef.current = currentTime;
    return true;
  };

  return {
    shouldProcessFrame
  };
}; 