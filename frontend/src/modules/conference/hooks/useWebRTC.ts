import { useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAppSelector } from '../../../store/hooks';
import { selectConferenceState } from '../store/conferenceSlice';

interface UseWebRTCProps {
    roomId: string;
    token: string | null;
    canvasStream: MediaStream | null;
    onRemoteStream?: (stream: MediaStream, fromUserId: string) => void;
}

const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export const useWebRTC = ({ roomId, token, canvasStream, onRemoteStream }: UseWebRTCProps) => {
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const { socket, isConnected, sendOffer, sendAnswer, sendIceCandidate } = useWebSocket(token);
    const { userId: currentUserId } = useAppSelector(selectConferenceState);

    // Инициализация RTCPeerConnection
    const initializePeerConnection = useCallback((targetUserId: string) => {
        // Закрываем предыдущее соединение корректно
        if (peerConnection.current) {
            const senders = peerConnection.current.getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    sender.track.stop();
                }
            });
            peerConnection.current.close();
        }

        console.log('Initializing new peer connection for:', targetUserId);
        peerConnection.current = new RTCPeerConnection(configuration);

        // Добавляем треки из canvas stream
        if (canvasStream) {
            console.log('Adding tracks from canvas stream:', canvasStream.getTracks());
            canvasStream.getTracks().forEach(track => {
                if (peerConnection.current) {
                    console.log('Adding track:', track.kind, track.readyState);
                    peerConnection.current.addTrack(track, canvasStream);
                }
            });
        }

        // Обработка ICE кандидатов
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && targetUserId) {
                sendIceCandidate(event.candidate, roomId, targetUserId);
            }
        };

        // Обработка входящего стрима
        peerConnection.current.ontrack = (event) => {
            console.log('Received remote track:', event.streams[0]);
            if (onRemoteStream && event.streams[0]) {
                onRemoteStream(event.streams[0], targetUserId || '');
            }
        };

        return peerConnection.current;
    }, [canvasStream, roomId, sendIceCandidate, onRemoteStream]);

    const createOffer = useCallback(async (targetUserId: string) => {
        const pc = initializePeerConnection(targetUserId);
        try {
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(offer);
            sendOffer(offer, roomId, targetUserId);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }, [initializePeerConnection, roomId, sendOffer]);

    const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
        // Игнорируем собственные офферы
        if (fromUserId === currentUserId) {
            console.log('Ignoring own offer');
            return;
        }
        console.log('Received offer from:', fromUserId, offer);
        const pc = initializePeerConnection(fromUserId);
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAnswer(answer, roomId, fromUserId);
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [initializePeerConnection, roomId, sendAnswer, currentUserId]);

    const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit, fromUserId: string) => {
        // Игнорируем собственные ответы
        if (fromUserId === currentUserId) {
            console.log('Ignoring own answer');
            return;
        }
        console.log('Received answer from:', fromUserId, answer);
        try {
            if (peerConnection.current && peerConnection.current.signalingState !== 'closed') {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }, [currentUserId]);

    const handleIceCandidate = useCallback(async ({ iceCandidate, fromUserId }: { iceCandidate: RTCIceCandidate; fromUserId: string }) => {
        // Игнорируем собственные ICE кандидаты
        if (fromUserId === currentUserId) {
            console.log('Ignoring own ICE candidate');
            return;
        }
        console.log('Received ICE candidate from:', fromUserId, iceCandidate);
        try {
            if (peerConnection.current && peerConnection.current.remoteDescription) {
                await peerConnection.current.addIceCandidate(iceCandidate);
            }
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Подписываемся на WebRTC события
        socket.on('offerReceived', handleOffer);
        socket.on('answerReceived', handleAnswer);
        socket.on('iceToClient', handleIceCandidate);

        // Очистка при размонтировании
        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            socket.off('offerReceived');
            socket.off('answerReceived');
            socket.off('iceToClient');
        };
    }, [socket, isConnected, handleOffer, handleAnswer, handleIceCandidate]);

    return {
        createOffer,
        peerConnection: peerConnection.current
    };
}; 