import {memo, useRef} from 'react';
import {useSegmentation} from '../hooks/useSegmentation.ts';
import {useVideoGridItemSize} from '../../layout/context/VideoGridContext.ts';
import {IWithIndex} from '../../layout/model/constants.ts';
import {useAppSelector} from '../../../store/hooks.ts';
import {selectBackgroundEffect} from '../store/visualEffectsSlice.ts';

export const BodySegmentationCanvas = memo<IWithIndex>(({index}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {width, height} = useVideoGridItemSize(index);
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