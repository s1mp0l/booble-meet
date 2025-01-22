require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

// CORS настройки
const corsOptions = {
    origin: process.env.CLIENT_URL || 'https://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const key = fs.readFileSync('./certs/cert.key'); //for local development https
const cert = fs.readFileSync('./certs/cert.crt'); //for local development https

const port = process.env.PORT || 3001;  // используем порт из .env
const server = https.createServer({key, cert}, app);

// Настройка Socket.IO с теми же CORS опциями
const io = new Server(server, {
    cors: corsOptions,
    transports: ['websocket', 'polling'],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    withCredentials: true,
    secure: false,
    rejectUnauthorized: false,
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { io, server, app };
