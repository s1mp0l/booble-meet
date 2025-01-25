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

const WS_URL = import.meta.env.VITE_WS_URL;

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

// Тип для обработчиков WebRTC событий
type WebRTCHandlers = {
    [userId: string]: {
        onOffer: (offer: RTCSessionDescriptionInit) => void;
        onAnswer: (answer: RTCSessionDescriptionInit) => void;
        onIceCandidate: (candidate: RTCIceCandidate) => void;
    }
}

export const useWebSocket = (token: string | null) => {
    const dispatch = useDispatch();
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const { isConnected, error } = useSelector(selectWebSocketState);
    const handlersRef = useRef<WebRTCHandlers>({});

    useEffect(() => {
        if (!token) return;

        console.log('Attempting WebSocket connection with token:', token);

        // Используем относительный путь, который будет проксироваться через Vite
        socketRef.current = io(WS_URL, {
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

        // WebRTC события
        socket.on('offerReceived', (offer, fromUserId) => {
            console.log('Received offer from:', fromUserId);
            const handler = handlersRef.current[fromUserId]?.onOffer;
            if (handler) {
                handler(offer);
            }
        });

        socket.on('answerReceived', (answer, fromUserId) => {
            console.log('Received answer from:', fromUserId);
            const handler = handlersRef.current[fromUserId]?.onAnswer;
            if (handler) {
                handler(answer);
            }
        });

        socket.on('iceToClient', ({ iceCandidate, fromUserId }) => {
            console.log('Received ICE candidate from:', fromUserId);
            const handler = handlersRef.current[fromUserId]?.onIceCandidate;
            if (handler) {
                handler(iceCandidate);
            }
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

    // Регистрация обработчиков для конкретного пользователя
    const registerHandlers = (userId: string, handlers: {
        onOffer: (offer: RTCSessionDescriptionInit) => void;
        onAnswer: (answer: RTCSessionDescriptionInit) => void;
        onIceCandidate: (candidate: RTCIceCandidate) => void;
    }) => {
        handlersRef.current[userId] = handlers;
        return () => {
            delete handlersRef.current[userId];
        };
    };

    return {
        isConnected,
        error,
        socket: socketRef.current,
        sendOffer,
        sendAnswer,
        sendIceCandidate,
        registerHandlers
    };
}; 