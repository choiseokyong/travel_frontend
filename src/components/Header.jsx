// components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  // console.log(isLoggedIn);
  return (
    <>
    {/* 상단 네비게이션 바 */}
    <AppBar position="static" sx={{ bgcolor: '#4fc3f7' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }} onClick={() => navigate('/')}>
          여행 플래너
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate('/plans/list')}
          sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
        >
          나의 일정
        </Button>
        {/* <Button
          color="inherit"
          onClick={() => navigate('/plans/new')}
          sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
        >
          일정 만들기
        </Button> */}
        {isLoggedIn ?(
          <>
          <Button
            color="inherit"
            onClick={() => navigate('/users/mypage')}
            sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
          >
            마이페이지
          </Button>
          <Button
            color="inherit"
            onClick={onLogout}
            sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
          >
            로그아웃
          </Button>
          </>
        ) : (
          <>
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
          >
            로그인
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/signup')}
            sx={{ fontWeight: 'bold', ':hover': { backgroundColor: '#ffb74d', color: '#212121' } }}
          >
            회원가입
          </Button>
          </>
        )}
        
        
      </Toolbar>
    </AppBar>
    </>
  );
};

export default Header;
