import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { signup } from '../services/authService';


const defaultTheme = createTheme();

export default function Signup() {
  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:'',
    email:'',
    passWord:'',
    grade:''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

     // 프론트엔드 유효성 검사
  if (!form.name || !form.email || !form.passWord) {
    setError('모든 필드를 입력해주세요.');
    alert('모든 필드를 입력해주세요.');
    return;
  }

  // 이메일 형식 체크
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    setError('올바른 이메일 형식이 아닙니다.');
    alert('올바른 이메일 형식이 아닙니다.');
    return;
  }

  // 비밀번호 길이 체크
  if (form.passWord.length < 8) {
    setError('비밀번호는 최소 6자리 이상이어야 합니다.');
    alert('비밀번호는 최소 8자리 이상이어야 합니다.');
    return;
  }

    try {
      const response = await signup(form);
      // 성공 처리
      setSuccess(true);
      alert("회원가입 성공");
      navigate('/login');
      
    } catch (err) {
      // 에러 처리
      setError(err.response?.data?.message || '회원가입 실패');
      alert(err.response.data.error);
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
            회원가입
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="이름"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passWord"
              label="비밀번호"
              type="password"
              id="passWord"
              value={form.passWord}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              회원가입
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  이미 계정이 있나요? 로그인
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
