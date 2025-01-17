import {memo, RefObject, useRef, useState} from "react";
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {useSegmentation} from "../hooks/useSegmentation.ts";

interface FaceDetectionCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
}

const FaceDetectionCanvas = memo(({videoRef}: FaceDetectionCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions] = useState({width: 640, height: 360});
  const {isModelLoaded, error} = useSegmentation({
    videoRef,
    canvasRef,
    fps: 30
  });

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
        width={dimensions.width}
        height={dimensions.height}
        className="webcam-video"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </>
  );
});

FaceDetectionCanvas.displayName = "FaceDetectionCanvas";

export {
  FaceDetectionCanvas
}