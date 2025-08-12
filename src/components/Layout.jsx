// components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 마운트 시 세션스토리지 토큰 확인해서 로그인 상태 초기화
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    // console.log(token);
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
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
