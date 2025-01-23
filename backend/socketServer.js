const io = require('./server').io;
const jwt = require('jsonwebtoken');

const linkSecret = process.env.LINK_SECRET;

const connectedUsers = [];

const allKnownOffers = {};

// Функция для проверки, есть ли еще пользователи в комнате
const hasUsersInRoom = (roomId) => {
    return connectedUsers.some(user => user.roomId === roomId);
};

// Функция очистки данных комнаты
const cleanupRoom = (roomId) => {
    if (!hasUsersInRoom(roomId) && allKnownOffers[roomId]) {
        console.log(`Cleaning up room ${roomId} - no users left`);
        delete allKnownOffers[roomId];
    }
};

// Функция получения пользователей в комнате
const getRoomUsers = (roomId) => {
    return connectedUsers.filter(user => user.roomId === roomId);
};

// Функция получения сокета по userId
const getSocketByUserId = (userId) => {
    const user = connectedUsers.find(u => u.userId === userId);
    return user ? user.socketId : null;
};

io.on('connection', socket => {
    console.log(socket.id, "has connected")

    const handshakeData = socket.handshake.auth.jwt;
    let decodedData
    try {
        decodedData = jwt.verify(handshakeData, linkSecret);
    } catch(err) {
        console.log(err);
        socket.disconnect()
        return
    }

    const { username, roomId, userId } = decodedData;

    // Присоединяем сокет к комнате
    socket.join(roomId);
    console.log(`User ${username} (${userId}) joined room ${roomId}`);

    // Проверяем, не подключен ли уже пользователь
    const existingUser = connectedUsers.find(u => u.userId === userId && u.roomId === roomId)
    if (existingUser) {
        existingUser.socketId = socket.id;
    } else {
        const newUser = {
            socketId: socket.id,
            username,
            roomId,
            userId
        };
        connectedUsers.push(newUser);
        
        // Отправляем событие о новом пользователе всем в комнате
        socket.to(roomId).emit('userJoined', newUser);
    }

    // Отправляем список пользователей в комнате
    const roomUsers = getRoomUsers(roomId);
    socket.emit('roomUsers', roomUsers);

    // WebRTC сигналинг
    socket.on('newOffer', ({ offer, roomId, targetUserId }) => {
        if (userId === targetUserId) {
            console.log('Skipping self-offer');
            return;
        }
        console.log(`New offer from ${username} (${userId}) for user ${targetUserId} in room ${roomId}`);
        const targetSocketId = getSocketByUserId(targetUserId);
        if (targetSocketId) {
            socket.to(targetSocketId).emit('offerReceived', offer, userId);
        }
    });

    socket.on('newAnswer', ({ answer, roomId, targetUserId }) => {
        if (userId === targetUserId) {
            console.log('Skipping self-answer');
            return;
        }
        console.log(`New answer from ${username} (${userId}) for user ${targetUserId} in room ${roomId}`);
        const targetSocketId = getSocketByUserId(targetUserId);
        if (targetSocketId) {
            socket.to(targetSocketId).emit('answerReceived', answer, userId);
        }
    });

    socket.on('iceToServer', ({ iceCandidate, roomId, targetUserId }) => {
        console.log(`New ICE candidate from ${username} (${userId}) for user ${targetUserId} in room ${roomId}`);
        if (userId === targetUserId) {
            console.log('Skipping self-ice-candidate');
            return;
        }
        const targetSocketId = getSocketByUserId(targetUserId);
        if (targetSocketId) {
            socket.to(targetSocketId).emit('iceToClient', {
                iceCandidate,
                fromUserId: userId
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${username} (${userId}) disconnected from room ${roomId}`);
        const index = connectedUsers.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
            const disconnectedUser = connectedUsers[index];
            connectedUsers.splice(index, 1);
            cleanupRoom(disconnectedUser.roomId);
            
            // Отправляем событие об отключении пользователя всем в комнате
            socket.to(roomId).emit('userLeft', socket.id);
        }
        socket.leave(roomId);
    });
});
