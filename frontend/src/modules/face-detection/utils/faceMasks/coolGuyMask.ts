import * as faceDetection from '@tensorflow-models/face-detection';
import {Point, MaskDrawerOptions} from '../../model/types';
import {smoothPosition} from '../interpolation';
import {loadImage as loadImageUtil} from '../loadImage';
import {drawRotatedImage} from '../canvas';

export const createCoolGuyMask = (
  imageSrc: string,
  options: MaskDrawerOptions = {}
) => {
  let glassesImage: HTMLImageElement | null = null;
  
  // Сохраняем предыдущие позиции глаз для интерполяции
  let prevLeftEye: Point | null = null;
  let prevRightEye: Point | null = null;
  
  // Применяем параметры с значениями по умолчанию
  const {
    smoothingFactor = 0.5,
    scale = 3 // Увеличенный масштаб, чтобы очки покрывали оба глаза
  } = options;

  // Загружаем изображение при первом вызове
  const ensureImageLoaded = async () => {
    if (!glassesImage) {
      glassesImage = await loadImageUtil(imageSrc);
    }
    return glassesImage;
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

      // Вычисляем центр между глазами и размер очков
      const centerX = (leftEye.x + rightEye.x) / 2;
      const centerY = (leftEye.y + rightEye.y) / 2;
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
      );
      
      // Размер очков зависит от расстояния между глазами
      const glassesWidth = eyeDistance * scale;
      const glassesHeight = glassesWidth * (img.height / img.width); // Сохраняем пропорции изображения

      // Вычисляем угол наклона между глазами и добавляем 180 градусов для корректной ориентации
      const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) + Math.PI;

      // Рисуем очки с центром между глазами
      drawRotatedImage(
        ctx,
        img,
        centerX,
        centerY,
        glassesWidth,
        angle,
        glassesHeight
      );
    }
  };
}; 