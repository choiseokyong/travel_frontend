// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소 (STS4 서버)
  withCredentials: true, // refreshToken 쿠키 전송용
  headers: {
    'Content-Type': 'application/json',
  },
});

export const refreshApi = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소 (STS4 서버)
  withCredentials: true, // refreshToken 쿠키 전송용
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
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try{
        // Refresh 요청
        const res = await refreshApi.post("/users/auth/refresh");
        console.log(res.data);
        const newAccessToken = res.data.token;
  

        // 새 토큰 저장 (ex. localStorage)
        localStorage.setItem("accessToken", newAccessToken);

        // 헤더 갱신 후 요청 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }catch(err){
        // Refresh도 실패 → 로그인 화면으로 이동
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


