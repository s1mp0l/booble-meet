import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { wsConnected, wsDisconnected, wsError } from '../store/webSocketSlice';
import { RootState } from '../../../store';

export const useWebSocket = (token: string | null) => {
    const dispatch = useDispatch();
    const socketRef = useRef<Socket | null>(null);
    const { isConnected, error } = useSelector((state: RootState) => state.webSocket);

    useEffect(() => {
        if (!token) return;

        console.log('Attempting WebSocket connection with token:', token);

        // Используем относительный путь, который будет проксироваться через Vite
        socketRef.current = io('/', {
            auth: {
                jwt: token
            },
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            withCredentials: true,
            autoConnect: true
        });

        const socket = socketRef.current;

        socket.on('connect_error', (error: Error) => {
            console.error('Connection error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            dispatch(wsError(error.message));
        });

        socket.on('connect', () => {
            console.log('WebSocket connected successfully');
            dispatch(wsConnected());
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected, reason:', reason);
            dispatch(wsDisconnected());
        });

        // Очистка при размонтировании
        return () => {
            console.log('Cleaning up WebSocket connection');
            if (socket) {
                socket.removeAllListeners();
                socket.close();
                socketRef.current = null;
            }
        };
    }, [token, dispatch]);

    // Функции для отправки сообщений
    const sendOffer = (offer: RTCSessionDescriptionInit, roomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('newOffer', { offer, roomId });
        }
    };

    const sendAnswer = (answer: RTCSessionDescriptionInit, roomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('newAnswer', { answer, roomId });
        }
    };

    const sendIceCandidate = (
        iceCandidate: RTCIceCandidate,
        roomId: string,
        isOfferer: boolean
    ) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('iceToServer', {
                iceCandidate,
                roomId,
                isOfferer
            });
        }
    };

    return {
        isConnected,
        error,
        socket: socketRef.current,
        sendOffer,
        sendAnswer,
        sendIceCandidate
    };
}; 