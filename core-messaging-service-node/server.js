const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
app.use('/api/messages', messageRoutes);

// Add a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Core Messaging Service!');
});

// Use PORT from .env file or default to 10001
const PORT = process.env.PORT || 10001;

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
