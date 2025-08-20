// src/services/noAuthApi.js
import axios from 'axios';

const NoApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default NoApi;
