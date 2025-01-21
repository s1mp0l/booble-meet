import {Button, Drawer, Space} from 'antd';
import {memo, useState} from 'react';
import {FaceMaskType} from '../model/types';
import { FACE_MASKS } from '../model/constants';

interface MaskSelectorProps {
  currentMask: FaceMaskType | null;
  onSelectMask: (mask: FaceMaskType | null) => void;
}

export const MaskSelector = memo(({currentMask, onSelectMask}: MaskSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        type="primary"
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 20,
          transform: 'scale(-1, 1)'
        }}
      >
        {currentMask ? 'Сменить маску' : 'Выбрать маску'}
      </Button>

      <Drawer
        title="Выберите маску"
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        <Space direction="vertical" style={{width: '100%'}}>
          {FACE_MASKS.map(({type, label}) => (
            <Button
              key={type}
              onClick={() => {
                onSelectMask(currentMask === type ? null : type);
                setIsOpen(false);
              }}
              type={currentMask === type ? 'primary' : 'default'}
              block
            >
              {currentMask === type ? `Отключить "${label}"` : label}
            </Button>
          ))}
        </Space>
      </Drawer>
    </>
  );
});

MaskSelector.displayName = 'MaskSelector'; 