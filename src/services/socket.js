// src/services/socket.js

import { io } from 'socket.io-client';

// Replace with your actual backend URL
const SOCKET_URL = 'http://localhost:3000'; // Adjust as necessary

const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});

export default socket;
