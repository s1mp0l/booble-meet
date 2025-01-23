import * as faceDetection from '@tensorflow-models/face-detection';
import {Point, MaskDrawerOptions} from '../../model/types';
import {smoothPosition} from '../interpolation';
import {loadImage as loadImageUtil} from '../loadImage';
import {drawRotatedImage} from '../canvas';
import {getRotationAngle} from '../animation';

// Функция для создания маски с глазами
export const createEyeMaskDrawer = (
  eyeImageSrc: string,
  options: MaskDrawerOptions = {}
) => {
  let eyeImage: HTMLImageElement | null = null;
  const startTime = Date.now();
  
  // Сохраняем предыдущие позиции глаз для интерполяции
  let prevLeftEye: Point | null = null;
  let prevRightEye: Point | null = null;
  
  // Применяем параметры с значениями по умолчанию
  const {
    smoothingFactor = 0.5,
    animationDuration = 1000,
    scale = 0.7
  } = options;

  // Загружаем изображение при первом вызове
  const ensureImageLoaded = async () => {
    if (!eyeImage) {
      eyeImage = await loadImageUtil(eyeImageSrc);
    }
    return eyeImage;
  };

  return async (
    ctx: CanvasRenderingContext2D,
    keypoints: faceDetection.Keypoint[],
  ) => {
    const img = await ensureImageLoaded();

    // Находим ключевые точки глаз
    const leftEyePoint = keypoints.find(point => point.name === 'leftEye');
    const rightEyePoint = keypoints.find(point => point.name === 'rightEye');

    if (leftEyePoint && rightEyePoint) {
      // Создаем текущие позиции
      const currentLeftEye = { x: leftEyePoint.x, y: leftEyePoint.y };
      const currentRightEye = { x: rightEyePoint.x, y: rightEyePoint.y };

      // Применяем сглаживание
      const leftEye = smoothPosition(currentLeftEye, prevLeftEye, smoothingFactor);
      const rightEye = smoothPosition(currentRightEye, prevRightEye, smoothingFactor);

      // Сохраняем текущие позиции для следующего кадра
      prevLeftEye = leftEye;
      prevRightEye = rightEye;

      // Вычисляем размер глаза на основе сглаженных позиций
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
      );
      const eyeSize = eyeDistance * scale;
      const rotationAngle = getRotationAngle(startTime, animationDuration);

      // Рисуем глаза с использованием сглаженных позиций
      drawRotatedImage(
        ctx,
        img,
        leftEye.x,
        leftEye.y,
        eyeSize,
        rotationAngle
      );

      drawRotatedImage(
        ctx,
        img,
        rightEye.x,
        rightEye.y,
        eyeSize,
        -rotationAngle
      );
    }
  };
}; 