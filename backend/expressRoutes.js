const app = require('./server').app;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const linkSecret = process.env.LINK_SECRET;
const clientUrl = process.env.CLIENT_URL;

// Создание новой конференции
app.post('/conference/create', (req, res) => {
    const { username, userId } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const roomId = uuidv4();
    const token = jwt.sign({ username, roomId, userId }, linkSecret);
    const conferenceUrl = `${clientUrl}/conference/${roomId}?token=${token}`;

    res.json({
        roomId,
        conferenceUrl,
        token
    });
});

// Присоединение к существующей конференции
app.post('/conference/join/:roomId', (req, res) => {
    const { username, userId } = req.body;
    const { roomId } = req.params;

    if (!username || !roomId) {
        return res.status(400).json({ error: 'Username and roomId are required' });
    }

    const token = jwt.sign({ username, roomId, userId }, linkSecret);
    const conferenceUrl = `${clientUrl}/conference/${roomId}?token=${token}`;

    res.json({
        roomId,
        conferenceUrl,
        token,
        userId
    });
});

// Валидация токена
app.post('/validate-token', (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const decodedData = jwt.verify(token, linkSecret);
        res.json(decodedData);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});