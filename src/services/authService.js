// src/services/authService.js
import api from './api';

// 회원가입
export const signup = (data) => api.post('/users/form', data);

// 로그인
export const login = (data) => api.post('/users/login', data);

export const planForm = (data) => api.post('/plans/form', data);
