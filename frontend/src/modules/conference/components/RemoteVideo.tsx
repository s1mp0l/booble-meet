import { memo, useRef, useEffect } from 'react';
import { IWithIndex } from '../../layout/model/constants';
import { useVideoGridItemSize } from '../../layout/context/VideoGridContext';

interface RemoteVideoProps extends IWithIndex {
    username: string;
    userId: string;
    stream: MediaStream | null;
}

export const RemoteVideo = memo<RemoteVideoProps>(({ username, stream, index }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { width, height } = useVideoGridItemSize(index);

    // Устанавливаем поток в video элемент
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Очищаем ресурсы при размонтировании
    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width, height }}>
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                zIndex: 1
            }}>
                {username}
            </div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </div>
    );
});

RemoteVideo.displayName = 'RemoteVideo'; 