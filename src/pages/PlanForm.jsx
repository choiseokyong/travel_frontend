import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Stack, Box, Tabs, Tab, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import koLocale from 'date-fns/locale/ko';
import { useNavigate, useParams } from 'react-router-dom';
import { planForm, planListOne, planModify, planItemDel } from '../services/authService';
import { format } from 'date-fns';
import ModalMapSearch from "./ModalMapSearch";


const PlanForm = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const [plan, setPlan] = useState(null);
  // 장소 선택 값
  const [onSelectPlace, setOnSelectPlace] = useState(null);
  const [dayTabs, setDayTabs] = useState(['Day 1']);
  const [currentTab, setCurrentTab] = useState(0);
  const [days, setDays] = useState([
    { day: 1, details: [{no:"", place: "", memo: "", planSort: 1,lat:null, lng:null }] }
  ]);

  const [planInfo,setPlanInfo] = useState({
      no:'',
      title:'',
      startDate:null,
      endDate:null,
      memo:''
    });
  const [dayDelInfo, setDayDelInfo] = useState({
    planNo:numericId,
    day:0
  });

  const handleChange = (field, value) => {
    setPlanInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const navigate = useNavigate();

  const [kakaoLoaded, setKakaoLoaded] = useState(false);
useEffect(() => {
    if (days) {
      console.log("부모에서 받은 선택 장소:", days);
    }
  }, [days]);
 // 선택된 장소가 바뀌면 현재 Day, 현재 detail에 반영

  const [selectedIdx, setSelectedIdx] = useState(0); // 선택된 detail 인덱스
  useEffect(() => {
    if (onSelectPlace !== null && selectedIdx != null) {
      console.log("selectedIdx : " + selectedIdx);
      setDays(prev => {
        const updated = [...prev];
        updated[currentTab].details[selectedIdx] = {
          ...updated[currentTab].details[selectedIdx],
          place: onSelectPlace.place_name,
          lat: onSelectPlace.y,
          lng: onSelectPlace.x,
          address: onSelectPlace.road_address_name || onSelectPlace.address_name,
        };
        return updated;
      });
      // 선택 반영 후 초기화
    setOnSelectPlace(null);
    }
  }, [onSelectPlace, currentTab, selectedIdx]);

 useEffect(() => {
  if(id != null){
   
    const fetchPlans = async () => {
      try {
        const res = await planListOne(numericId);
        setPlan(res.data);
        setPlanInfo({no:res.data.no,title:res.data.title,startDate:new Date(res.data.startDate),endDate:new Date(res.data.endDate),memo:res.data.memo});
        // Day별 객체로 변환
        const dayMap = res.data?.item?.reduce((acc, curr) => {
          if (!acc[curr.day]) acc[curr.day] = [];
          acc[curr.day].push(curr);
          return acc;
        }, {}) || {}; 
        // 묶인 데이터를 배열로 변환(렌더링용)
        const modifyDays = Object.keys(dayMap).map(day => ({
          day: Number(day),
          details: dayMap[day]
        }));
        
        const tabs = modifyDays.map(day => `Day ${day.day}`);
        setDayTabs(tabs);
        setDays(modifyDays);
        setCurrentTab(0);
        
      
        console.log('저장 성공', res.data);
      } catch (err) {
        console.error('저장 실패', err);
      }
    };
    fetchPlans();
  }

  
  

  
}, []);

  // 선택 시 days 업데이트
  const handleSelectPlace = (place) => {
    setDays(prev => {
      const updated = [...prev];
      updated[currentTab].details[selectedIdx] = { 
        ...updated[currentTab].details[selectedIdx], 
        ...place 
      };
      return updated;
    });
    setOpenDialog(false);
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
  const handleDeletePlaceMemo = async (detailIdx,detailNo) => {
    if(detailNo != null){
      const res = await planItemDel(detailNo);
    }
    setDays(prev =>
      prev.map((day, dayIdx) => {
        if (dayIdx !== currentTab) return day;

        const newDetails = day.details
          .filter((_, i) => i !== detailIdx)
          .map((item, idx) => ({ ...item, planSort: idx + 1 }));

        return { ...day, details: newDetails };
      })
    );
    
  };



  // 새 Day 추가
  const handleAddDay = () => {
    const nextDay = days.length + 1;
    setDays(prev => [...prev, { day: nextDay, details: [{ place: "", memo: "", planSort: 1, lat: null, lng: null }] }]);
    setDayTabs(prev => [...prev, `Day ${nextDay}`]);
    setCurrentTab(nextDay - 1);
  };


// Day 삭제 함수
const handleDeleteDay = async (dayIdx) => {
  
  if (days.length === 1) {
    alert("마지막 Day는 삭제할 수 없습니다.");
    return;
  }
  console.log("days 확인 : ", days[dayIdx].details[0].no);
  setDays(prev => {
    const newDays = prev.filter((_, idx) => idx !== dayIdx)
      .map((day, idx) => ({ ...day, day: idx + 1 })); // Day 번호 재정렬
    return newDays;
  });

  setDayTabs(prev => {
    const newTabs = prev.filter((_, idx) => idx !== dayIdx)
      .map((_, idx) => `Day ${idx + 1}`);
    return newTabs;
  });

  // 현재 Tab이 삭제된 Day였으면 이전 Tab 선택
  setCurrentTab(prev => (prev >= dayIdx ? Math.max(prev - 1, 0) : prev));
  const delInfo = { ...dayDelInfo, day: dayIdx + 1 };
  setDayDelInfo(delInfo); // 상태 업데이트
  console.log("전송용:", delInfo); // 정확한 값 확인 가능
  //  try {
      
  //     let res;
  //     if(id == null){
  //       res = await planForm(payload);
  //     }else{
  //       res = await planModify(payload);
  //     }
  //     console.log('저장 성공', res.data);
  //   } catch (err) {
  //     console.error('저장 실패', err);
  //   }
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
      console.log(id);
      let res;
      if(id == null){
        res = await planForm(payload);
      }else{
        res = await planModify(payload);
      }
      console.log('저장 성공', res.data);
    } catch (err) {
      console.error('저장 실패', err);
    }
    navigate('/plans/list');
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
        <TextField
          label="메모"
          value={planInfo.memo}
          onChange={(e) => handleChange('memo', e.target.value)}
          fullWidth
          multiline      // 여러 줄 입력 가능
          rows={4}       // 기본 표시 줄 수
          placeholder="여행 관련 메모를 입력하세요"
        />
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

        {days[currentTab] && days[currentTab].details.map((detail, idx) => (
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
            
            <ModalMapSearch
              idx={idx}                  // 줄 인덱스 전달
              onSelectPlace={(place, idx) => {
                setSelectedIdx(idx);
                setOnSelectPlace(place);}} // useEffect에서 반영
            />
            
            <IconButton color="error" onClick={() => handleDeletePlaceMemo(idx,detail.no)} sx={{ flexShrink: 0 }}>
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
        <Button variant="outlined" color="error" onClick={() => handleDeleteDay(currentTab)}>- 일차 삭제</Button>
        <Button type="submit" variant="contained">💾 저장</Button>
      </Stack>

      
    </Box>
    
    </Container>
    
  );
};

export default PlanForm;
