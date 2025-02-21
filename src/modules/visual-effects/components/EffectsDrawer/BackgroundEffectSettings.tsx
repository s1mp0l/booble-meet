import { memo } from 'react';
import { Radio, Space, ColorPicker, Slider } from 'antd';
import type { ColorPickerProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectBackgroundEffect, setBackgroundEffect } from '../../store/visualEffectsSlice';
import type { BackgroundEffect } from '../../model/types';

export const BackgroundEffectSettings = memo(() => {
  const dispatch = useAppDispatch();
  const backgroundEffect = useAppSelector(selectBackgroundEffect);

  const handleBackgroundChange = (type: BackgroundEffect['type']) => {
    if (type === 'none') {
      dispatch(setBackgroundEffect({ type: 'none' }));
    } else if (type === 'color') {
      dispatch(setBackgroundEffect({
        type: 'color',
        color: { r: 0, g: 0, b: 0, a: 255 }
      }));
    } else {
      dispatch(setBackgroundEffect({
        type: 'bokeh',
        backgroundBlurAmount: 10
      }));
    }
  };

  const handleColorChange: ColorPickerProps['onChange'] = (value) => {
    if (backgroundEffect.type === 'color') {
      const rgba = value.toRgb();
      dispatch(setBackgroundEffect({
        type: 'color',
        color: {
          r: rgba.r,
          g: rgba.g,
          b: rgba.b,
          a: Math.round(rgba.a * 255)
        }
      }));
    }
  };

  const handleBlurAmountChange = (value: number | null) => {
    if (backgroundEffect.type === 'bokeh' && value !== null) {
      dispatch(setBackgroundEffect({
        type: 'bokeh',
        backgroundBlurAmount: value
      }));
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group
        value={backgroundEffect.type}
        onChange={(e) => handleBackgroundChange(e.target.value)}
      >
        <Space direction="vertical">
          <Radio value="none">Без эффекта</Radio>
          <Radio value="color">Цветной фон</Radio>
          <Radio value="bokeh">Размытие</Radio>
        </Space>
      </Radio.Group>

      {backgroundEffect.type === 'color' && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <span>Цвет фона:</span>
          <ColorPicker
            format="rgb"
            value={`rgba(${backgroundEffect.color.r}, ${backgroundEffect.color.g}, ${backgroundEffect.color.b}, ${backgroundEffect.color.a / 255})`}
            onChange={handleColorChange}
            allowClear={false}
            size="large"
          />
        </Space>
      )}

      {backgroundEffect.type === 'bokeh' && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <span>Сила размытия:</span>
          <Slider
            min={1}
            max={20}
            value={backgroundEffect.backgroundBlurAmount}
            onChange={handleBlurAmountChange}
            tooltip={{ formatter: (value) => `${value}px` }}
            marks={{
              1: '1px',
              10: '10px',
              20: '20px'
            }}
          />
        </Space>
      )}
    </Space>
  );
}); 