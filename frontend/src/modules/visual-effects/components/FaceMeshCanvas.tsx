import {memo, RefObject, useEffect, useMemo, useRef} from "react";
import {useFaceDetection} from "../hooks/useFaceDetection.ts";
import {useAppSelector} from "../../../store/hooks.ts";
import {selectFaceMask} from "../store/visualEffectsSlice.ts";
import {createEyeMaskDrawer} from "../utils/faceMasks/eyeMask.ts";
import {createCoolGuyMask} from "../utils/faceMasks/coolGuyMask.ts";
import {createMoustacheMask} from "../utils/faceMasks/moustacheMask.ts";

interface FaceMeshCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
  width: number;
  height: number;
}

const FaceMeshCanvas = memo(({videoRef, width, height}: FaceMeshCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentMask = useAppSelector(selectFaceMask);

  // Создаем функцию отрисовки маски в зависимости от типа
  const drawMask = useMemo(() => {
    switch (currentMask) {
      case 'eyes':
        return createEyeMaskDrawer('/assets/eye.png');
      case 'glasses':
        return createCoolGuyMask('/assets/coolGuy.png');
      case 'mustache':
        return createMoustacheMask('/assets/moustache.png');
      case 'none':
      default:
        return undefined;
    }
  }, [currentMask]);

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