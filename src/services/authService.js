// src/services/authService.js
import {api,refreshApi} from './api';
import NoApi from './NoApi';

// 일정 공유
export const planSharePage = (uuid) => NoApi.get(`/plans/share/${uuid}`);

// 일정 공유
export const planShare = (id) => api.post(`/plans/share/new/${id}`);

// 회원정보 수정
export const myPageForm = (data) => api.put('/users/modify', data);

// 회원정보
export const myPage = () => api.get('/users/mypage/form');

// 회원가입
export const signup = (data) => api.post('/users/form', data);

// 로그인
export const login = (data) => api.post('/users/login', data);

// 로그아웃
export const logout = () => refreshApi.post('/users/logout');

// plan 등록
export const planForm = (data) => api.post('/plans/form', data);

// plan 수정
export const planModify = (data) => api.put('/plans/modify', data);

// plan 삭제
export const planDel = (id) => api.delete(`/plans/delete/${id}`);

// planItem 삭제
export const planItemDel = (id) => api.delete(`/plans/delete/item/${id}`);

// plan 목록
export const planList = (data) => api.post('/plans/list', data);

// plan 1개 목록
export const planListOne = (id) => api.get(`/plans/list/${id}`);

// 구글 placeapi 현재 사용 x
// export const placeApi = (keyword) => api.get(`/api/places?query=${encodeURIComponent(keyword)}`);
