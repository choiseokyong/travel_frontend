import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useOutletContext  } from 'react-router-dom';
import { login } from '../services/authService';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();

  const [logininfo,setLogin] = useState({
    email:'',
    passWord:''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { onLogin } = useOutletContext();

  const handleChange = (e) => {
    setLogin({
      ...logininfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      setError(null);
      setSuccess(false);
  
      try {
        const response = await login(logininfo);
        // 서버에서 JWT 발급받아 저장
      // console.log('로그인 버튼 클릭됨', logininfo);
        sessionStorage.setItem("accessToken", response.data);
        // 성공 처리
        // setSuccess(true);
        // console.log('로그인 성공:', response.data);
        onLogin();
        navigate('/');
      } catch (err) {
        // 에러 처리
        setError(err.response?.data?.message || '로그인 실패');
      }
      // 여기서 API 호출 → 성공하면 navigate('/login')
      
    };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              value={login.email}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passWord"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={login.passWord}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  회원가입
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
