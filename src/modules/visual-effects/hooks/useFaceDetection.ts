import {RefObject, useCallback, useRef} from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

interface UseFaceDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
}

interface FaceDetectionResult {
  keypoints: faceDetection.Keypoint[];
  face: faceDetection.Face;
}

export const useFaceDetection = ({
  videoRef,
}: UseFaceDetectionProps) => {
  const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const isInitializedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const initializeDetector = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      console.log('Initializing detector...');
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
      } as const;

      detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
      isInitializedRef.current = true;
      console.log('Detector initialized successfully');
    } catch (err) {
      console.error('Error initializing detector:', err);
    }
  }, []);

  const detectFace = useCallback(async (): Promise<FaceDetectionResult | null> => {
    if (
      !videoRef.current ||
      !detectorRef.current ||
      !isInitializedRef.current ||
      isProcessingRef.current ||
      videoRef.current.readyState !== 4
    ) {
      return null;
    }

    isProcessingRef.current = true;

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current, {
        flipHorizontal: false
      });

      isProcessingRef.current = false;

      if (faces.length > 0) {
        const face = faces[0];
        if (face.keypoints) {
          return {
            keypoints: face.keypoints,
            face
          };
        }
      }
      return null;
    } catch (err) {
      console.error('Ошибка при обработке кадра:', err);
      isProcessingRef.current = false;
      return null;
    }
  }, [videoRef]);

  return {
    initializeDetector,
    detectFace,
    isInitialized: isInitializedRef.current
  };
};