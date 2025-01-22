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

    const { username, roomId } = decodedData;

    // Проверяем, не подключен ли уже пользователь
    const existingUser = connectedUsers.find(u => u.username === username && u.roomId === roomId)
    if (existingUser) {
        existingUser.socketId = socket.id;
    } else {
        connectedUsers.push({
            socketId: socket.id,
            username,
            roomId
        })
    }

    // Отправляем существующее предложение, если оно есть
    const offerForThisRoom = allKnownOffers[roomId];
    if (offerForThisRoom) {
        socket.emit('existingOffer', offerForThisRoom);
    }

    socket.on('newAnswer', ({answer, roomId}) => {
        allKnownOffers[roomId] = {
            ...allKnownOffers[roomId],
            answer
        };
        
        // Отправляем ответ всем в комнате, кроме отправителя
        socket.to(roomId).emit('answerReceived', answer);
    });

    socket.on('newOffer', ({offer, roomId}) => {
        allKnownOffers[roomId] = {
            offer,
            offererIceCandidates: [],
            answer: null,
            answerIceCandidates: []
        };

        // Отправляем предложение всем в комнате, кроме отправителя
        socket.to(roomId).emit('offerReceived', offer);
    });

    socket.on('iceToServer', ({iceCandidate, roomId, isOfferer}) => {
        const offerToUpdate = allKnownOffers[roomId];
        if (offerToUpdate) {
            if (isOfferer) {
                offerToUpdate.offererIceCandidates.push(iceCandidate);
                socket.to(roomId).emit('iceToClient', iceCandidate);
            } else {
                offerToUpdate.answerIceCandidates.push(iceCandidate);
                socket.to(roomId).emit('iceToClient', iceCandidate);
            }
        }
    });

    socket.on('disconnect', () => {
        const index = connectedUsers.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
            const disconnectedUser = connectedUsers[index];
            connectedUsers.splice(index, 1);
            // Проверяем и очищаем комнату после отключения пользователя
            cleanupRoom(disconnectedUser.roomId);
        }
    });
});
