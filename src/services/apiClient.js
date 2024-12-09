// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    // withCredentials: true, // Remove or comment out this line
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;