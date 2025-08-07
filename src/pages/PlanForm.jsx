import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Stack, Box, Tabs, Tab, Paper
} from '@mui/material';
import { LocalizationProvider, DatePicker  } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';
import { useNavigate } from 'react-router-dom';

const PlanForm = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dayTabs, setDayTabs] = useState(['Day 1']);
  const [currentTab, setCurrentTab] = useState(0);
  const [dayDetails, setDayDetails] = useState([
  { place: '', memo: '' }
]);
  const navigate = useNavigate();

  const handleAddDay = () => {
    setDayTabs([...dayTabs, `Day ${dayTabs.length + 1}`]);
    setDayDetails([...dayDetails, { place: '', memo: '' }]); // 새 일차 세부 정보 추가
  };

  const handleDetailChange = (field, value) => {
    const updated = [...dayDetails];
    updated[currentTab][field] = value;
    setDayDetails(updated);
  };


  const handleSave = () => {
    const newPlan = {
      title,
      startDate: dateRange[0]?.toISOString().split('T')[0],
      endDate: dateRange[1]?.toISOString().split('T')[0],
      memo: '',
      days: dayTabs.map(() => []) // 일차별 빈 일정
    };

    const stored = JSON.parse(localStorage.getItem('plans')) || [];
    stored.push(newPlan);
    localStorage.setItem('plans', JSON.stringify(stored));
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>📝 새 여행 일정 만들기</Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="여행 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
          <DatePicker
            calendars={2}
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            localeText={{ start: '시작일', end: '종료일' }}
          />
          <DatePicker
            calendars={2}
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            localeText={{ start: '시작일', end: '종료일' }}
          />
        </LocalizationProvider>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          {dayTabs.map((label, index) => (
            <Tab label={label} key={index} />
          ))}
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>일차별 일정 입력 영역 (Day {currentTab + 1})</Typography>
        <TextField
          label="장소"
          value={dayDetails[currentTab]?.place || ''}
          onChange={(e) => handleDetailChange('place', e.target.value)}
          fullWidth
        />
        <TextField
          label="메모"
          value={dayDetails[currentTab]?.memo || ''}
          onChange={(e) => handleDetailChange('memo', e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 2 }}
        />
        {/* 👉 여기 나중에 시간, 장소, 메모 입력 들어갈 예정 */}
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleAddDay}>+ 일차 추가</Button>
        <Button variant="contained" onClick={handleSave}>💾 저장</Button>
      </Stack>
    </Container>
  );
};

export default PlanForm;
