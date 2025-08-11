// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소 (STS4 서버)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
