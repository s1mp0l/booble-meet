import { memo } from 'react';
import { UserOutlined } from '@ant-design/icons';

interface VideoPlaceholderProps {
  width?: number | string;
  height?: number | string;
}

const VideoPlaceholder = memo<VideoPlaceholderProps>(({
  width = '100%',
  height = '100%'
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      height,
      background: '#1f1f1f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--default-border-radius)',
      zIndex: 1
    }}>
      <UserOutlined style={{ fontSize: '64px', color: '#666' }} />
    </div>
  );
});

VideoPlaceholder.displayName = 'VideoPlaceholder';

export {
  VideoPlaceholder
}; 