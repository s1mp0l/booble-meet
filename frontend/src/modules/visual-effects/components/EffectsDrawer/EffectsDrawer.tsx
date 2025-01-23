import { memo } from 'react';
import { Drawer, Tabs } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectIsEffectsDrawerOpen, toggleEffectsDrawer } from '../../store/visualEffectsSlice';
import { BackgroundEffectSettings } from './BackgroundEffectSettings';
import { FaceMaskSettings } from './FaceMaskSettings';

export const EffectsDrawer = memo(() => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsEffectsDrawerOpen);

  return (
    <Drawer
      title="Настройки эффектов"
      placement="right"
      onClose={() => dispatch(toggleEffectsDrawer())}
      open={isOpen}
      width={300}
    >
      <Tabs
        items={[
          {
            key: 'background',
            label: 'Фон',
            children: <BackgroundEffectSettings />
          },
          {
            key: 'face',
            label: 'Маска лица',
            children: <FaceMaskSettings />
          }
        ]}
      />
    </Drawer>
  );
}); 