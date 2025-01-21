import {memo, RefObject, useRef} from "react";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {useSegmentation} from "../hooks/useSegmentation.ts";
import {IWithIndex} from "../../layout/model/constants.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";

interface BodySegmentationCanvasProps extends IWithIndex {
  videoRef: RefObject<HTMLVideoElement>;
}

const BodySegmentationCanvas = memo(({videoRef, index}: BodySegmentationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {isModelLoaded, error} = useSegmentation({
    videoRef,
    canvasRef,
    fps: 30
  });

  const {width, height} = useVideoGridItemSize(index);

  return (
    <>
      {!isModelLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          {error ? `Ошибка: ${error.message}` : 'Загрузка модели...'}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="webcam-video"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          objectFit: 'cover'
        }}
      />
    </>
  );
});

BodySegmentationCanvas.displayName = "BodySegmentationCanvas";

export {
  BodySegmentationCanvas
}