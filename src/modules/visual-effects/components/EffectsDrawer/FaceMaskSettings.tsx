import { memo } from 'react';
import { Radio, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectFaceMask, setFaceMask } from '../../store/visualEffectsSlice';

export const FaceMaskSettings = memo(() => {
  const dispatch = useAppDispatch();
  const faceMask = useAppSelector(selectFaceMask);

  return (
    <Radio.Group
      value={faceMask}
      onChange={(e) => dispatch(setFaceMask(e.target.value))}
    >
      <Space direction="vertical">
        <Radio value="none">Без маски</Radio>
        <Radio value="eyes">Глаза</Radio>
        <Radio value="glasses">Очки</Radio>
        <Radio value="mustache">Усы</Radio>
      </Space>
    </Radio.Group>
  );
}); 