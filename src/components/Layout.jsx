// components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { logout } from '../services/authService';

const Layout = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 마운트 시 로컬스토리지 토큰 확인해서 로그인 상태 초기화
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    // console.log(token);
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    const res = await logout();
    setIsLoggedIn(false);
    window.location.href = '/login'; 
  };

  // 로그인 성공 시 호출할 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
      <>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
      <main>
        <Outlet context={{ onLogin: handleLogin }}/>
      </main>
    </>
  )
};

export default Layout;
