import { useEffect, useRef, useCallback } from 'react';

interface UseWebRTCProps {
    roomId: string;
    targetUserId: string;
    canvasStream: MediaStream | null;
    onRemoteStream?: (stream: MediaStream) => void;
    sendOffer: (offer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => void;
    sendAnswer: (answer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => void;
    sendIceCandidate: (candidate: RTCIceCandidate, roomId: string, targetUserId: string) => void;
}

const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export const useWebRTC = ({ 
    roomId, 
    targetUserId,
    canvasStream, 
    onRemoteStream,
    sendOffer,
    sendAnswer,
    sendIceCandidate
}: UseWebRTCProps) => {
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const isInitiator = useRef<boolean>(false);

    // Функция для добавления треков
    const addTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
        const senders = pc.getSenders();
        const existingTracks = senders.map(sender => sender.track?.id);

        stream.getTracks().forEach(track => {
            if (!existingTracks.includes(track.id)) {
                console.log('Adding track:', track.kind, track.readyState);
                try {
                    pc.addTrack(track, stream);
                } catch (error) {
                    console.error('Error adding track:', error);
                }
            }
        });
    }, []);

    // Инициализация RTCPeerConnection
    const initializePeerConnection = useCallback(() => {
        // Закрываем предыдущее соединение, если оно существует
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        console.log('Initializing peer connection for:', targetUserId);
        const newPeerConnection = new RTCPeerConnection(configuration);

        // Добавляем треки из canvas stream если они есть
        if (canvasStream) {
            addTracks(newPeerConnection, canvasStream);
        }

        // Обработка ICE кандидатов
        newPeerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                sendIceCandidate(event.candidate, roomId, targetUserId);
            }
        };

        // Обработка состояния соединения
        newPeerConnection.onconnectionstatechange = () => {
            const state = newPeerConnection.connectionState;
            console.log(`Connection state with ${targetUserId}:`, state);
            
            if (state === 'failed' || state === 'closed') {
                console.log('Connection failed or closed');
            }
        };

        // Обработка состояния ICE
        newPeerConnection.oniceconnectionstatechange = () => {
            const state = newPeerConnection.iceConnectionState;
            console.log(`ICE connection state with ${targetUserId}:`, state);
            
            if (state === 'failed') {
                console.log('ICE connection failed');
            } else if (state === 'connected') {
                console.log('ICE connection established successfully');
            }
        };

        // Обработка изменения состояния согласования
        newPeerConnection.onsignalingstatechange = () => {
            const state = newPeerConnection.signalingState;
            console.log(`Signaling state with ${targetUserId}:`, state);
            
            if (state === 'stable') {
                console.log('Signaling state is stable, connection established');
            }
        };

        // Обработка входящего стрима
        newPeerConnection.ontrack = (event) => {
            console.log('Received remote track from:', targetUserId, event.streams[0]);
            if (onRemoteStream && event.streams[0]) {
                onRemoteStream(event.streams[0]);
            }
        };

        // Обработка ошибок согласования
        newPeerConnection.onicecandidateerror = (event) => {
            console.error('ICE candidate error:', event);
        };

        peerConnection.current = newPeerConnection;
        return newPeerConnection;
    }, [canvasStream, roomId, targetUserId, sendIceCandidate, onRemoteStream, addTracks]);

    // Создание оффера
    const createOffer = useCallback(async () => {
        console.log('Creating offer for:', targetUserId);
        isInitiator.current = true;
        const pc = peerConnection.current || initializePeerConnection();
        
        try {
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(offer);
            sendOffer(offer, roomId, targetUserId);
        } catch (error) {
            console.error('Error creating offer:', error);
            isInitiator.current = false;
        }
    }, [initializePeerConnection, roomId, targetUserId, sendOffer]);

    // Обработка входящего оффера
    const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        console.log('Received offer from:', targetUserId);
        isInitiator.current = false;
        const pc = peerConnection.current || initializePeerConnection();

        try {
            if (pc.signalingState !== 'stable') {
                console.log('Signaling state is not stable, rolling back');
                await Promise.all([
                    pc.setLocalDescription({type: "rollback"}),
                    pc.setRemoteDescription(new RTCSessionDescription(offer))
                ]);
            } else {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
            }
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAnswer(answer, roomId, targetUserId);
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [initializePeerConnection, roomId, targetUserId, sendAnswer]);

    // Обработка входящего ответа
    const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        console.log('Received answer from:', targetUserId);
        const pc = peerConnection.current;
        
        if (!pc) {
            console.error('No peer connection when receiving answer');
            return;
        }

        try {
            if (pc.signalingState === 'have-local-offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
                console.warn('Unexpected signaling state for answer:', pc.signalingState);
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }, [targetUserId]);

    // Обработка ICE кандидата
    const handleIceCandidate = useCallback(async (iceCandidate: RTCIceCandidate) => {
        console.log('Received ICE candidate for:', targetUserId);
        const pc = peerConnection.current;
        
        if (!pc) {
            console.error('No peer connection when receiving ICE candidate');
            return;
        }

        try {
            await pc.addIceCandidate(iceCandidate);
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }, [targetUserId]);

    // Обновляем треки при изменении canvasStream
    useEffect(() => {
        if (!canvasStream || !peerConnection.current) return;

        const pc = peerConnection.current;
        // Удаляем старые треки
        pc.getSenders().forEach(sender => {
            if (sender.track) {
                pc.removeTrack(sender);
            }
        });
        
        // Добавляем новые треки
        addTracks(pc, canvasStream);

        // Если мы инициатор и соединение уже установлено, создаем новый оффер
        if (isInitiator.current && pc.connectionState === 'connected') {
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .then(() => {
                    if (pc.localDescription) {
                        sendOffer(pc.localDescription, roomId, targetUserId);
                    }
                })
                .catch(error => console.error('Error updating offer after track change:', error));
        }
    }, [canvasStream, addTracks, roomId, targetUserId, sendOffer]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
        };
    }, []);

    return {
        createOffer,
        handleOffer,
        handleAnswer,
        handleIceCandidate
    };
}; 