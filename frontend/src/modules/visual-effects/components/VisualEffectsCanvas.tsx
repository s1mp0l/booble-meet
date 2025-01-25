import { memo, RefObject, useEffect, useMemo, useRef } from "react";
import { useSegmentation } from "../hooks/useSegmentation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectFaceMask, selectBackgroundEffect, setEffectsStream } from "../store/visualEffectsSlice";
import { useFrameRate } from "../hooks/useFrameRate";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { useDrawFaceMask } from "../hooks/useDrawFaceMask";

interface VisualEffectsCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
  width: number;
  height: number;
}

export const VisualEffectsCanvas = memo<VisualEffectsCanvasProps>(({
  videoRef,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dispatch = useAppDispatch();
  
  const currentMask = useAppSelector(selectFaceMask);
  const backgroundEffect = useAppSelector(selectBackgroundEffect);
  const { shouldProcessFrame } = useFrameRate({ fps: 30 });

  const hasActiveEffects = currentMask !== 'none' || backgroundEffect.type !== 'none';

  // Функция для отрисовки базового видео
  const drawBaseVideo = useMemo(() => {
    return (ctx: CanvasRenderingContext2D) => {
      if (!videoRef.current) return;
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    };
  }, [videoRef, width, height]);

  // Инициализируем отрисовку маски
  const { initializeMask, drawMask } = useDrawFaceMask({
    videoRef,
    maskType: currentMask
  });

  // Инициализируем сегментацию
  const { processSegmentation } = useSegmentation({
    videoRef,
    effect: backgroundEffect
  });

  // Основной цикл отрисовки
  const processFrame = useMemo(() => {
    return async () => {
      if (!canvasRef.current || !hasActiveEffects || !shouldProcessFrame(performance.now())) {
        return;
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.save();
      
      // Если есть эффект фона, применяем сегментацию
      if (backgroundEffect.type !== 'none') {
        await processSegmentation(canvasRef.current);
      } else {
        // Иначе просто рисуем видео
        drawBaseVideo(ctx);
      }

      // Если есть маска, рисуем её
      if (currentMask !== 'none') {
        await drawMask(ctx);
      }

      ctx.restore();
    };
  }, [
    hasActiveEffects, 
    backgroundEffect, 
    currentMask,
    processSegmentation, 
    shouldProcessFrame, 
    drawBaseVideo,
    drawMask
  ]);

  // Запускаем цикл анимации
  useAnimationFrame(processFrame);

  // Создаем и обновляем MediaStream из canvas
  useEffect(() => {
    if (!canvasRef.current || !hasActiveEffects) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        dispatch(setEffectsStream(null));
      }
      return;
    }

    const stream = canvasRef.current.captureStream(30);
    streamRef.current = stream;
    dispatch(setEffectsStream(stream));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        dispatch(setEffectsStream(null));
      }
    };
  }, [hasActiveEffects, dispatch]);

  // Инициализируем маску при изменении типа
  useEffect(() => {
    if (currentMask !== 'none') {
      initializeMask();
    }
  }, [initializeMask, currentMask]);

  if (!hasActiveEffects) {
    return null;
  }

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

VisualEffectsCanvas.displayName = "VisualEffectsCanvas"; 