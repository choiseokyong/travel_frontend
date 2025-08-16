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

// 팝업
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";


const PlanForm = () => {
  // 팝업 상태 값
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  // const [title, setTitle] = useState('');
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [dayTabs, setDayTabs] = useState(['Day 1']);
  const [currentTab, setCurrentTab] = useState(0);
  const [days, setDays] = useState([
    { day: 1, details: [{ place: "", memo: "", planSort: 1,lat:null, lng:null }] }
  ]);

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

  // Kakao 지도 키워드 변환
  const searchPlace = async (keyword) => {
  if (!keyword) return [];
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    console.log("status:", res.status);
    const data = await res.json();
    console.log("data:", data);

    // 구글 API는 results 배열에 검색 결과가 들어있음
    if (!data.results) return [];
    
    return data.results.map(doc => ({
      lat: doc.geometry.location.lat,
      lng: doc.geometry.location.lng,
      place_name: doc.name,
      address_name: doc.formatted_address
    }));
  } catch (err) {
    console.error("키워드 변환 실패", err);
    return [];
  }
};


  const handleSearch = async (keyword, idx) => {
    const results = await searchPlace(keyword);
    console.log(results)
    if (results.length > 0) {
      setSearchResults(results);
      setSelectedIdx(idx);
      setOpenDialog(true);
    } else {
      alert("검색 결과가 없습니다1.");
    }
  };



  // 현재 Day에 장소/메모 한 줄 추가
  const handleAddPlaceMemo = () => {
    setDays(prev => {
      return prev.map((day, idx) => {
        if (idx === currentTab) {
          const nextSort =
            day.details.length > 0
              ? day.details[day.details.length - 1].planSort + 1
              : 1;

          // 새 배열 생성
          return {
            ...day,
            details: [...day.details, { place: "", memo: "", planSort: nextSort, lat: null, lng: null }]
          };
        }
        return day;
      });
    });
  };



  // 장소/메모 입력 변경
  const handleDetailChange = (detailIdx, field, value) => {
    setDays(prev => {
      const updated = [...prev];
      updated[currentTab].details[detailIdx][field] = value;
      return updated;
    });
  };


  // 장소/메모 줄 삭제
  const handleDeletePlaceMemo = (detailIdx) => {
    setDays(prev => {
      const updated = [...prev];
      updated[currentTab].details = updated[currentTab].details
        .filter((_, i) => i !== detailIdx)
        .map((item, idx) => ({ ...item, planSort: idx + 1 }));
      return updated;
    });
  };


  // 새 Day 추가
  const handleAddDay = () => {
    const nextDay = days.length + 1;
    setDays(prev => [...prev, { day: nextDay, details: [{ place: "", memo: "", planSort: 1, lat: null, lng: null }] }]);
    setDayTabs(prev => [...prev, `Day ${nextDay}`]);
    setCurrentTab(nextDay - 1);
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
      item: days.flatMap(day =>
        day.details.map(d => ({ ...d, day: day.day }))
      )
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
          />
          <DatePicker
            label="종료일"
            value={planInfo.endDate}
            onChange={(newValue) => handleChange('endDate',newValue)}
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

        {days[currentTab].details.map((detail, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "center", mt: idx > 0 ? 2 : 0 }}>
            <TextField
              label="장소"
              value={detail.place}
              onChange={(e) => handleDetailChange(idx, "place", e.target.value)}
              fullWidth
            />
            <TextField
              label="메모"
              value={detail.memo}
              onChange={(e) => handleDetailChange(idx, "memo", e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSearch(detail.place, idx)}
            >
              🔍검색
            </Button>
            
            <IconButton color="error" onClick={() => handleDeletePlaceMemo(idx)} sx={{ flexShrink: 0 }}>
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
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
      <DialogTitle>검색 결과 선택</DialogTitle>
      <DialogContent>
        <List>
          {searchResults.map((place, i) => (
            <ListItem 
              button 
              key={i} 
              onClick={() => {
                setDays(prev => {
                  const updated = [...prev];
                  updated[currentTab].details[selectedIdx] = { 
                    ...updated[currentTab].details[selectedIdx], 
                    ...place 
                  };
                  return updated;
                });
                setOpenDialog(false);
              }}
            >
              <ListItemText 
                primary={place.place_name} 
                secondary={place.address_name} 
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>닫기</Button>
      </DialogActions>
    </Dialog>
    </Container>
    
  );
};

export default PlanForm;
