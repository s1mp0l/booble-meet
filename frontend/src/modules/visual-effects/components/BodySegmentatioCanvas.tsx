import {memo, useRef} from 'react';
import {useSegmentation} from '../hooks/useSegmentation.ts';
import {useAppSelector} from '../../../store/hooks.ts';
import {selectBackgroundEffect} from '../store/visualEffectsSlice.ts';

interface BodySegmentationCanvasProps {
  width: number;
  height: number;
}

export const BodySegmentationCanvas = memo<BodySegmentationCanvasProps>(({width, height}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effect = useAppSelector(selectBackgroundEffect);

  useSegmentation({
    videoRef: {current: document.getElementById('webcam-video-client') as HTMLVideoElement},
    canvasRef,
    effect
  });

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
      }}
    />
  );
});