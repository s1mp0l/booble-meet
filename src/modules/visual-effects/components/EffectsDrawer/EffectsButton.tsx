import { memo } from 'react';
import { Button } from 'antd';
import { SkinTwoTone } from '@ant-design/icons';
import { useAppDispatch } from '../../../../store/hooks';
import { toggleEffectsDrawer } from '../../store/visualEffectsSlice';

export const EffectsButton = memo(() => {
  const dispatch = useAppDispatch();

  return (
    <Button
      type="text"
      icon={<SkinTwoTone style={{ fontSize: '20px' }}  />}
      onClick={() => dispatch(toggleEffectsDrawer())}
      style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 20,
      }}
    >
      Эффекты
    </Button>
  );
}); 