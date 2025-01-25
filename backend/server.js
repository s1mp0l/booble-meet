require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();

// CORS настройки
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Настройка Socket.IO с теми же CORS опциями
const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling'],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    withCredentials: true
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { io, server, app };
