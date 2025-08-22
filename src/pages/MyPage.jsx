import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  FormHelperText
} from "@mui/material";
import { myPage, myPageForm } from '../services/authService';

function MyPage() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    passWord: ""
  });

  useEffect(() => {
    const fetchMyPage = async () => {
        try {
        const res = await myPage();
        setUser(res.data);
        console.log('저장 성공', res.data);
        } catch (err) {
        console.error('저장 실패', err);
        }
    };
    fetchMyPage();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
        const res = await myPageForm(user);
        setUser(res.data);
        alert("수정 완료");
        console.log('저장 성공', res.data);
    } catch (err) {
        console.error('저장 실패', err);
    }
    
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            마이페이지
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* 이메일 (읽기 전용) */}
          <TextField
            label="이메일"
            name="email"
            value={user.email}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          /> 

          {/* 이름 */}
          <TextField
            label="이름"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* 닉네임 */}
          {/* <TextField
            label="닉네임"
            name="nickname"
            value={user.nickname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          /> */}

          {/* 새 비밀번호 */}
          <TextField
            label="새 비밀번호"
            type="passWord"
            name="passWord"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
            <FormHelperText sx={{ ml: 1, mb: 2, color: "gray" }}>
            새 비밀번호 입력 시 기존 비밀번호가 변경됩니다.
            </FormHelperText>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            저장하기
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MyPage;
