import {useCallback, useEffect, useRef} from 'react';

export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    callback();
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return {
    previousTimeRef
  };
}; 