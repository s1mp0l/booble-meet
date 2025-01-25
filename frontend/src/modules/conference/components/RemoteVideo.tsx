import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { useVideoGridItemSize } from '../../layout/context/VideoGridContext';
import { useWebRTC } from '../hooks/useWebRTC';
import { useAppSelector } from '../../../store/hooks';
import { selectConferenceState } from '../store/conferenceSlice';
import { selectSelfWebCamVideoStream } from '../../webcam-video/store/slice';

interface RemoteVideoProps {
    username: string;
    userId: string;
    sendOffer: (offer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => void;
    sendAnswer: (answer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => void;
    sendIceCandidate: (candidate: RTCIceCandidate, roomId: string, targetUserId: string) => void;
    registerHandlers: (userId: string, handlers: {
        onOffer: (offer: RTCSessionDescriptionInit) => void;
        onAnswer: (answer: RTCSessionDescriptionInit) => void;
        onIceCandidate: (candidate: RTCIceCandidate) => void;
    }) => () => void;
}

export const RemoteVideo = memo<RemoteVideoProps>(({ 
    username, 
    userId, 
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    registerHandlers
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { width, height } = useVideoGridItemSize();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const { roomId } = useAppSelector(selectConferenceState);
    const canvasStream = useAppSelector(selectSelfWebCamVideoStream);
    const currentUserId = useAppSelector(state => state.conference.userId) || '';

    // Определяем, кто должен быть инициатором на основе сравнения userId
    const shouldInitiateConnection = currentUserId > userId;

    // Обработчики WebRTC событий
    const handleRemoteStream = useCallback((stream: MediaStream) => {
        console.log('Setting remote stream for:', username);
        setRemoteStream(stream);
    }, [username]);

    // Инициализируем WebRTC
    const { createOffer, handleOffer, handleAnswer, handleIceCandidate } = useWebRTC({
        roomId: roomId || '',
        targetUserId: userId,
        canvasStream,
        onRemoteStream: handleRemoteStream,
        sendOffer,
        sendAnswer,
        sendIceCandidate
    });

    // Регистрируем обработчики WebRTC событий
    useEffect(() => {
        const unregister = registerHandlers(userId, {
            onOffer: handleOffer,
            onAnswer: handleAnswer,
            onIceCandidate: handleIceCandidate
        });

        return () => {
            unregister();
        };
    }, [userId, handleOffer, handleAnswer, handleIceCandidate, registerHandlers]);

    // Устанавливаем поток в video элемент
    useEffect(() => {
        if (videoRef.current && remoteStream) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Инициируем соединение только если мы должны быть инициатором
    useEffect(() => {
        if (roomId && shouldInitiateConnection) {
            console.log('Initiating connection with:', username, '(we are the initiator)');
            createOffer();
        }
    }, [roomId, username, createOffer, shouldInitiateConnection]);

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