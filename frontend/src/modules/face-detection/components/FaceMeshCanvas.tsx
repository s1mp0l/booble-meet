import {memo, RefObject, useEffect, useRef} from "react";
import {useFaceDetection} from "../hooks/useFaceDetection.ts";
import {IWithIndex} from "../../layout/model/constants.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";

interface FaceMeshCanvasProps extends IWithIndex {
  videoRef: RefObject<HTMLVideoElement>;
}

const FaceMeshCanvas = memo(({videoRef, index}: FaceMeshCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {initializeDetector} = useFaceDetection({
    videoRef,
    canvasRef,
    fps: 30,
    minDetectionConfidence: 0.5
  });

  const {width, height} = useVideoGridItemSize(index);

  useEffect(() => {
    initializeDetector();
  }, [initializeDetector]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        objectFit: 'cover'
      }}
    />
  );
});

FaceMeshCanvas.displayName = "FaceMeshCanvas";

export {
  FaceMeshCanvas
}; 