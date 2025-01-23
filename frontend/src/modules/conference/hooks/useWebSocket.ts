import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { 
    wsConnected, 
    wsDisconnected, 
    wsError, 
    selectWebSocketState,
    setConnectedUsers,
    addConnectedUser,
    removeConnectedUser
} from '../store/conferenceSlice';

// Типы для WebSocket событий
interface ServerToClientEvents {
    offerReceived: (offer: RTCSessionDescriptionInit, fromUserId: string) => void;
    answerReceived: (answer: RTCSessionDescriptionInit, fromUserId: string) => void;
    iceToClient: (data: { iceCandidate: RTCIceCandidate; fromUserId: string }) => void;
    userJoined: (user: { username: string; roomId: string; socketId: string; userId: string }) => void;
    userLeft: (socketId: string) => void;
    roomUsers: (users: { username: string; roomId: string; socketId: string; userId: string }[]) => void;
}

interface ClientToServerEvents {
    newOffer: (data: { offer: RTCSessionDescriptionInit; roomId: string; targetUserId: string }) => void;
    newAnswer: (data: { answer: RTCSessionDescriptionInit; roomId: string; targetUserId: string }) => void;
    iceToServer: (data: { iceCandidate: RTCIceCandidate; roomId: string; targetUserId: string }) => void;
}

export const useWebSocket = (token: string | null) => {
    const dispatch = useDispatch();
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const { isConnected, error } = useSelector(selectWebSocketState);

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

        // События пользователей
        socket.on('userJoined', (user) => {
            console.log('User joined:', user);
            dispatch(addConnectedUser(user));
        });

        socket.on('userLeft', (socketId) => {
            console.log('User left:', socketId);
            dispatch(removeConnectedUser(socketId));
        });

        socket.on('roomUsers', (users) => {
            console.log('Room users:', users);
            dispatch(setConnectedUsers(users));
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
    const sendOffer = (offer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('newOffer', { offer, roomId, targetUserId });
        }
    };

    const sendAnswer = (answer: RTCSessionDescriptionInit, roomId: string, targetUserId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('newAnswer', { answer, roomId, targetUserId });
        }
    };

    const sendIceCandidate = (
        iceCandidate: RTCIceCandidate,
        roomId: string,
        targetUserId: string
    ) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('iceToServer', {
                iceCandidate,
                roomId,
                targetUserId
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