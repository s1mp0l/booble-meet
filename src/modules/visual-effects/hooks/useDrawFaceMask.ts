import { useCallback, useRef, useEffect } from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import { FaceMaskType } from '../model/types';
import { getMaskDrawer } from '../utils/getMaskDrawer';
import { useFaceDetection } from './useFaceDetection';
import { RefObject } from 'react';

interface UseDrawFaceMaskProps {
  videoRef: RefObject<HTMLVideoElement>;
  maskType: FaceMaskType | 'none';
}

type MaskDrawerFunction = (ctx: CanvasRenderingContext2D, keypoints: faceDetection.Keypoint[]) => Promise<void>;

export const useDrawFaceMask = ({ videoRef, maskType }: UseDrawFaceMaskProps) => {
  const lastKeypointsRef = useRef<faceDetection.Keypoint[] | null>(null);
  const maskDrawerRef = useRef<MaskDrawerFunction | null>(null);
  const isDetectingRef = useRef(false);

  // Инициализируем детектор лица
  const { initializeDetector, detectFace } = useFaceDetection({
    videoRef
  });

  // Инициализация маски
  const initializeMask = useCallback(async () => {
    if (maskType === 'none') {
      maskDrawerRef.current = null;
      return;
    }
    const drawer = await getMaskDrawer(maskType);
    maskDrawerRef.current = drawer || null;
    await initializeDetector();
  }, [maskType, initializeDetector]);

  // Асинхронное обновление координат лица
  const updateFaceKeypoints = useCallback(async () => {
    if (isDetectingRef.current) return;
    
    isDetectingRef.current = true;
    const faceData = await detectFace();
    if (faceData) {
      lastKeypointsRef.current = faceData.keypoints;
    }
    isDetectingRef.current = false;
  }, [detectFace]);

  // Запускаем обновление координат лица в фоновом режиме
  useEffect(() => {
    let frameId: number;
    
    const detectLoop = () => {
      updateFaceKeypoints();
      frameId = requestAnimationFrame(detectLoop);
    };

    if (maskType !== 'none') {
      frameId = requestAnimationFrame(detectLoop);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [maskType, updateFaceKeypoints]);

  // Отрисовка маски (теперь синхронная)
  const drawMask = useCallback(async (ctx: CanvasRenderingContext2D) => {
    if (!maskDrawerRef.current || !lastKeypointsRef.current) return;
    await maskDrawerRef.current(ctx, lastKeypointsRef.current);
  }, []);

  return {
    initializeMask,
    drawMask
  };
}; 