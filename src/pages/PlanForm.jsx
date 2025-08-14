import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Stack, Box, Tabs, Tab, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';
import { useNavigate } from 'react-router-dom';
import { planForm } from '../services/authService';
import { format } from 'date-fns';

const PlanForm = () => {
  // const [title, setTitle] = useState('');
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [dayTabs, setDayTabs] = useState(['Day 1']);
  const [currentTab, setCurrentTab] = useState(0);
  const [dayDetails, setDayDetails] = useState(
    [{ place: '', memo: '', planSort:1 }] // Day 1 기본 한 줄
  );

  const [planInfo,setPlanInfo] = useState({
      title:'',
      startDate:null,
      endDate:null
    });

  const handleChange = (field, value) => {
    setPlanInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const navigate = useNavigate();

  // 현재 Day에 장소/메모 한 줄 추가
  const handleAddPlaceMemo = () => {
   setDayDetails(prev => [...prev, { day: currentTab, place: '', memo: '',planSort:prev[prev.length - 1].planSort+1 }]);
  };

  // 장소/메모 입력 변경
   const handleDetailChange = (index, field, value) => {
    setDayDetails(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // 장소/메모 줄 삭제
  const handleDeletePlaceMemo = (index) => {
    setDayDetails(prev => prev.filter((_, i) => i !== index)
                  .map((item,idx)=>({
                    ...item,
                    planSort: idx + 1
                  })));
  };

  // 새 Day 추가
  const handleAddDay = () => {
    const nextDay = dayTabs.length + 1;
    setDayTabs(prev => [...prev, nextDay]);
    setCurrentTab(nextDay);
    setDayDetails(prev => [...prev, { day: nextDay, place: '', memo: '' }]);
  };

  // 저장
  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 리로드 방지
    
    const payload = {
      ...planInfo,
      startDate: planInfo.startDate
        ? format(planInfo.startDate, 'yyyy-MM-dd')
        : null,
      endDate: planInfo.endDate
        ? format(planInfo.endDate, 'yyyy-MM-dd')
        : null,
      item: dayDetails
    };

    try {
      const res = await planForm(payload);
      console.log('저장 성공', res.data);
    } catch (err) {
      console.error('저장 실패', err);
    }
    // navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>📝 새 여행 일정 만들기</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {/* 여행 제목 & 날짜 선택 */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="여행 제목"
          value={planInfo.title}
          onChange={(e) => handleChange('title',e.target.value)}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
          <DatePicker
            label="시작일"
            value={planInfo.startDate}
            onChange={(newValue) => handleChange('startDate',newValue)}
            // renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="종료일"
            value={planInfo.endDate}
            onChange={(newValue) => handleChange('endDate',newValue)}
            // renderInput={(params) => <TextField {...params} />}
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

        {dayDetails.map((detail, idx) => (
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
        <Button type="submit" variant="contained">💾 저장</Button>
      </Stack>
    </Box>
    </Container>
  );
};

export default PlanForm;
