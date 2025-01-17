import {memo, useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../../store/hooks.ts";
import {selectSelfWebCamVideoStream} from "../../webcam-video/store/slice.ts";
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const FaceDetectionCanvas = memo(() => {
  const videoStream = useAppSelector(selectSelfWebCamVideoStream);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);
  const isProcessingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 360 });

  // Обработчик изменения размера
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = 16 / 9;
        const newHeight = Math.floor(containerWidth / aspectRatio);
        setDimensions({
          width: containerWidth,
          height: newHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Настраиваем скрытое видео для получения кадров
  useEffect(() => {
    const videoEl = hiddenVideoRef.current;
    if (videoEl && videoStream) {
      videoEl.srcObject = videoStream;
      videoEl.play().catch(console.error);
    }
  }, [videoStream]);

  useEffect(() => {
    if (!videoStream) return;

    let animationFrameId: number;
    let segmenter: bodySegmentation.BodySegmenter;
    let lastSegmentationTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30 FPS

    const initializeSegmenter = async () => {
      segmenter = await bodySegmentation.createSegmenter(
        bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
        {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
          modelType: 'general'
        }
      );
    };

    const runSegmentation = async () => {
      if (!videoStream || !outputCanvasRef.current || !bufferCanvasRef.current || !segmenter || !hiddenVideoRef.current) return;
      
      const currentTime = performance.now();
      const timeSinceLastSegmentation = currentTime - lastSegmentationTime;

      if (timeSinceLastSegmentation < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(runSegmentation);
        return;
      }

      if (isProcessingRef.current) {
        animationFrameId = requestAnimationFrame(runSegmentation);
        return;
      }

      isProcessingRef.current = true;

      try {
        const segmentation = await segmenter.segmentPeople(hiddenVideoRef.current, {
          flipHorizontal: false,
          multiSegmentation: false,
          segmentBodyParts: false
        });
      
        if (segmentation.length === 0) {
          isProcessingRef.current = false;
          animationFrameId = requestAnimationFrame(runSegmentation);
          return;
        }

        const foregroundThreshold = 0.6;
        const backgroundBlurAmount = 10;
        const edgeBlurAmount = 5;
        const flipHorizontal = false;

        // Рисуем на буферном canvas
        await bodySegmentation.drawBokehEffect(
          bufferCanvasRef.current,
          hiddenVideoRef.current,
          segmentation[0],
          foregroundThreshold,
          backgroundBlurAmount,
          edgeBlurAmount,
          flipHorizontal
        );

        // Копируем результат на видимый canvas
        const outputCtx = outputCanvasRef.current.getContext('2d');
        if (outputCtx) {
          outputCtx.clearRect(0, 0, dimensions.width, dimensions.height);
          outputCtx.drawImage(bufferCanvasRef.current, 0, 0, dimensions.width, dimensions.height);
        }

        lastSegmentationTime = currentTime;
        isProcessingRef.current = false;
        animationFrameId = requestAnimationFrame(runSegmentation);
      } catch (error) {
        console.error('Ошибка сегментации:', error);
        isProcessingRef.current = false;
      }
    };

    initializeSegmenter().then(() => {
      runSegmentation();
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dimensions, videoStream]);

  return (
    <div 
      ref={containerRef}
      className="face-detection-container" 
      style={{ 
        position: 'relative',
        width: '100%',
        height: dimensions.height,
        overflow: 'hidden'
      }}
    >
      <video
        ref={hiddenVideoRef}
        width={dimensions.width}
        height={dimensions.height}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />

      <canvas
        ref={outputCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="segmentation-canvas"
        style={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <canvas
        ref={bufferCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'none' }}
      />
    </div>
  );
});

FaceDetectionCanvas.displayName = "FaceDetectionCanvas";

export {
  FaceDetectionCanvas
}