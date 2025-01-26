import * as faceDetection from '@tensorflow-models/face-detection';
import {Point, MaskDrawerOptions} from '../../model/types';
import {smoothPosition, smoothRotation, smoothScale} from '../interpolation';
import {loadImage as loadImageUtil} from '../loadImage';
import {drawRotatedImage} from '../canvas';

export const createMoustacheMask = (
  imageSrc: string,
  options: MaskDrawerOptions = {}
) => {
  let moustacheImage: HTMLImageElement | null = null;
  
  // Сохраняем предыдущие значения для интерполяции
  let prevMouthCenter: Point | null = null;
  let prevAngle: number | null = null;
  let prevScale: number | null = null;
  
  // Применяем параметры с значениями по умолчанию
  const {
    smoothingFactor = 0.3,
    scale = 2 // Масштаб усов относительно расстояния между ртом и носом
  } = options;

  // Загружаем изображение при первом вызове
  const ensureImageLoaded = async () => {
    if (!moustacheImage) {
      moustacheImage = await loadImageUtil(imageSrc);
    }
    return moustacheImage;
  };

  return async (
    ctx: CanvasRenderingContext2D,
    keypoints: faceDetection.Keypoint[],
  ) => {
    const img = await ensureImageLoaded();

    // Находим ключевые точки рта и носа
    const mouth = keypoints.find(point => point.name === 'mouthCenter');
    const nose = keypoints.find(point => point.name === 'noseTip');

    if (mouth && nose) {
      // Вычисляем позицию усов (немного выше рта)
      const currentMouthCenter = {
        x: mouth.x,
        y: mouth.y - (mouth.y - nose.y) * 0.5 // Располагаем усы на 50% выше рта к носу
      };

      // Применяем сглаживание к позиции
      const mouthCenter = smoothPosition(currentMouthCenter, prevMouthCenter, smoothingFactor);
      
      // Вычисляем текущий угол наклона
      const currentAngle = Math.atan2(nose.y - mouth.y, nose.x - mouth.x) + Math.PI - Math.PI/2;
      
      // Применяем сглаживание к углу поворота
      const angle = smoothRotation(currentAngle, prevAngle, smoothingFactor);

      // Вычисляем текущий размер усов на основе расстояния между ртом и носом
      const currentFaceScale = Math.sqrt(
        Math.pow(mouth.x - nose.x, 2) + Math.pow(mouth.y - nose.y, 2)
      );
      
      // Применяем сглаживание к размеру
      const faceScale = smoothScale(currentFaceScale, prevScale, smoothingFactor);
      
      // Сохраняем текущие значения для следующего кадра
      prevMouthCenter = mouthCenter;
      prevAngle = angle;
      prevScale = faceScale;

      const moustacheWidth = faceScale * scale * 2; // Умножаем на 2, чтобы усы были шире
      const moustacheHeight = moustacheWidth * (img.height / img.width); // Сохраняем пропорции изображения

      // Рисуем усы
      drawRotatedImage(
        ctx,
        img,
        mouthCenter.x,
        mouthCenter.y,
        moustacheWidth,
        angle,
        moustacheHeight
      );
    }
  };
}; 