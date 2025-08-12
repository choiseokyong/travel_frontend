import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Stack, Box, Tabs, Tab, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { test } from '../services/authService';

const PlanForm = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dayTabs, setDayTabs] = useState(['Day 1']);
  const [currentTab, setCurrentTab] = useState(0);
  const [dayDetails, setDayDetails] = useState([
    [{ place: '', memo: '' }] // Day 1 기본 한 줄
  ]);
  const navigate = useNavigate();

  const [result, setResult] = useState('');
  const handleTest = async () => {
    try {
      const res = await test();  // 인증 확인용 간단 API 엔드포인트 예시
      setResult(`성공: ${JSON.stringify(res.data)}`);
    } catch (error) {
      if (error.response) {
        setResult(`실패: ${error.response.status} ${error.response.statusText}`);
      } else {
        setResult(`에러: ${error.message}`);
      }
    }
  };

  // 현재 Day에 장소/메모 한 줄 추가
  const handleAddPlaceMemo = () => {
    const updated = [...dayDetails];
    updated[currentTab].push({ place: '', memo: '' });
    setDayDetails(updated);
  };

  // 장소/메모 입력 변경
  const handleDetailChange = (index, field, value) => {
    const updated = [...dayDetails];
    updated[currentTab][index][field] = value;
    setDayDetails(updated);
  };

  // 장소/메모 줄 삭제
  const handleDeletePlaceMemo = (index) => {
    const updated = [...dayDetails];
    updated[currentTab].splice(index, 1);
    if (updated[currentTab].length === 0) {
      updated[currentTab].push({ place: '', memo: '' }); // 최소 1줄 유지
    }
    setDayDetails(updated);
  };

  // 새 Day 추가
  const handleAddDay = () => {
    setDayTabs([...dayTabs, `Day ${dayTabs.length + 1}`]);
    setDayDetails([...dayDetails, [{ place: '', memo: '' }]]);
  };

  // 저장
  const handleSave = () => {
    const newPlan = {
      title,
      startDate: startDate?.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
      days: dayDetails
    };

    const stored = JSON.parse(localStorage.getItem('plans')) || [];
    stored.push(newPlan);
    localStorage.setItem('plans', JSON.stringify(stored));
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>📝 새 여행 일정 만들기</Typography>

      {/* 여행 제목 & 날짜 선택 */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="여행 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
          <DatePicker
            label="시작일"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="종료일"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
      </Stack>

      {/* Day 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          {dayTabs.map((label, index) => (
            <Tab label={label} key={index} />
          ))}
        </Tabs>
      </Box>

      {/* 장소/메모 입력 영역 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Day {currentTab + 1} 일정
        </Typography>

        {dayDetails[currentTab].map((detail, idx) => (
          <Box
            key={idx}
            sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: idx > 0 ? 2 : 0 }}
          >
            <TextField
              label="장소"
              value={detail.place}
              onChange={(e) => handleDetailChange(idx, 'place', e.target.value)}
              fullWidth
            />
            <TextField
              label="메모"
              value={detail.memo}
              onChange={(e) => handleDetailChange(idx, 'memo', e.target.value)}
              fullWidth
            />
            <IconButton
              color="error"
              onClick={() => handleDeletePlaceMemo(idx)}
              sx={{ flexShrink: 0 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={handleAddPlaceMemo}
        >
          + 장소/메모 추가
        </Button>
      </Paper>

      {/* 버튼 영역 */}
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleAddDay}>+ 일차 추가</Button>
        <Button variant="contained" onClick={handleSave}>💾 저장</Button>
      </Stack>
      <div>
      <button onClick={handleTest}>인증 테스트 API 호출</button>
      <p>{result}</p>
    </div>
    </Container>
  );
};

export default PlanForm;
