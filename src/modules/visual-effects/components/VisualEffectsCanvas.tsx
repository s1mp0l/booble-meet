import { memo, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { useSegmentation } from "../hooks/useSegmentation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectFaceMask, selectBackgroundEffect, setEffectsStream } from "../store/visualEffectsSlice";
import { useFrameRate } from "../hooks/useFrameRate";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { useDrawFaceMask } from "../hooks/useDrawFaceMask";
import { selectSelfWebCamVideoStream } from "../../webcam-video/store/slice";

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
  const originalStream = useAppSelector(selectSelfWebCamVideoStream);
  const { shouldProcessFrame } = useFrameRate({ fps: 30 });

  // Функция для отрисовки базового видео
  const drawBaseVideo = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!videoRef.current) return;
    ctx.drawImage(videoRef.current, 0, 0, width, height);
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
      if (!canvasRef.current || !shouldProcessFrame(performance.now())) {
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
    backgroundEffect, 
    currentMask,
    processSegmentation, 
    shouldProcessFrame, 
    drawBaseVideo,
    drawMask,
  ]);

  // Запускаем цикл анимации
  useAnimationFrame(processFrame);

  // Создаем и обновляем MediaStream из canvas
  useEffect(() => {
    if (!canvasRef.current) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        dispatch(setEffectsStream(null));
      }
      return;
    }

    // Получаем видео поток с canvas
    const canvasStream = canvasRef.current.captureStream(30);
    
    // Создаем новый MediaStream
    const combinedStream = new MediaStream();

    // Добавляем видео трек с canvas
    const videoTrack = canvasStream.getVideoTracks()[0];
    if (videoTrack) {
      combinedStream.addTrack(videoTrack);
    }

    // Добавляем аудио трек из оригинального потока
    if (originalStream) {
      const audioTrack = originalStream.getAudioTracks()[0];
      if (audioTrack) {
        combinedStream.addTrack(audioTrack);
      }
    }

    streamRef.current = combinedStream;
    dispatch(setEffectsStream(combinedStream));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        dispatch(setEffectsStream(null));
      }
    };
  }, [dispatch, originalStream]);

  // Инициализируем маску при изменении типа
  useEffect(() => {
    if (currentMask !== 'none') {
      initializeMask();
    }
  }, [initializeMask, currentMask]);

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
        transform: 'scale(-1, 1)',
        objectFit: 'cover',
        zIndex: 100
      }}
    />
  );
});

VisualEffectsCanvas.displayName = "VisualEffectsCanvas"; 