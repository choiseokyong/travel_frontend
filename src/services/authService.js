// src/services/authService.js
import api from './api';

// 회원가입
export const signup = (data) => api.post('/users/form', data);

// 로그인
export const login = (data) => api.post('/users/login', data);

// plan 등록
export const planForm = (data) => api.post('/plans/form', data);

// plan 목록
export const planList = (data) => api.get('/plans/list');

// plan 1개 목록
export const planListOne = (id) => api.get(`/plans/list/${id}`);
