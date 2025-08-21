// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소 (STS4 서버)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 로그인 시 저장된 토큰

  //   console.log('요청 URL:', config.url);
  // console.log('요청 헤더:', config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login'; // 인증 만료 시 로그인으로 이동
    }
    return Promise.reject(error);
  }
);

export default api;
