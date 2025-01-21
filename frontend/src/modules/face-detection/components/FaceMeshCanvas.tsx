import {memo, RefObject, useEffect, useMemo, useRef} from "react";
import {useFaceDetection} from "../hooks/useFaceDetection.ts";
import {IWithIndex} from "../../layout/model/constants.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";
import {createEyeMaskDrawer} from "../utils/faceMasks.ts";

interface FaceMeshCanvasProps extends IWithIndex {
  videoRef: RefObject<HTMLVideoElement>;
  maskType?: 'eyes';
}

const FaceMeshCanvas = memo(({videoRef, index, maskType = 'eyes'}: FaceMeshCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {width, height} = useVideoGridItemSize(index);

  // Создаем функцию отрисовки маски в зависимости от типа
  const drawMask = useMemo(() => {
    switch (maskType) {
      case 'eyes':
        return createEyeMaskDrawer('/assets/eye.png');
      default:
        return undefined;
    }
  }, [maskType]);

  const {initializeDetector} = useFaceDetection({
    videoRef,
    canvasRef,
    fps: 30,
    onFaceDetected: drawMask
  });

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
        objectFit: 'cover',
        zIndex: 100
      }}
    />
  );
});

FaceMeshCanvas.displayName = "FaceMeshCanvas";

export {
  FaceMeshCanvas
}; 