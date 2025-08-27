import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Event, Place, AccessTime } from '@mui/icons-material';
import { planListOne,planDel, planShare } from '../services/authService';
import MapPlanDetail from "../components/MapPlanDetail";
import MapView from "../components/MapView"; // MapView 임포트

const PlanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);
  const [plan, setPlan] = useState(null);

  // 맵 모달
  const [mapOpen, setMapOpen] = useState(false);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapTitle, setMapTitle] = useState('');

  // PlanDetail 상단에 추가
const handleDayMapOpen = (dayDetails, dayNumber) => {
  
  const markers = dayDetails
    .filter(item => item.lat != null && item.lng != null)
    .map(item => ({ lat: item.lat, lng: item.lng }));
  console.log("dayDetails++ ",markers);
  if (markers.length === 0) {
    alert("해당 Day에 지도에 표시할 장소가 없습니다.");
    return;
  }

  setMapMarkers(markers);
  setMapTitle(`Day ${dayNumber} 지도`);
  setMapOpen(true);
};


  // 공유 링크 모달 상태
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Day별 객체로 변환
  const dayMap = plan?.item?.reduce((acc, curr) => {
    if (!acc[curr.day]) acc[curr.day] = [];
    acc[curr.day].push(curr);
    return acc;
  }, {}) || {}; 
  // 묶인 데이터를 배열로 변환(렌더링용)
  const days = Object.keys(dayMap).map(day => ({
    day: Number(day),
    details: dayMap[day]
  }));


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await planListOne(numericId);
        setPlan(res.data);
        console.log('저장 성공', res.data);
      } catch (err) {
        console.error('저장 실패', err);
      }
    };
    fetchPlans();
  }, [numericId]);

  

  // const handleDetailChange = (dayIdx, detailIdx, field, value) => {
  //   setPlan(prev => {
  //     const updatedItems = [...prev.item];
  //     const targetIdx = updatedItems.findIndex(
  //       d => d.day === days[dayIdx].day && d.planSort === days[dayIdx].details[detailIdx].planSort
  //     );
  //     updatedItems[targetIdx][field] = value;
  //     return { ...prev, item: updatedItems };
  //   });
  // };

  // const handleDelete = (dayIdx, detailIdx) => {
  //   setPlan(prev => {
  //     const updatedItems = prev.item.filter(
  //       d => !(d.day === days[dayIdx].day && d.planSort === days[dayIdx].details[detailIdx].planSort)
  //     );
  //     return { ...prev, item: updatedItems };
  //   });
  // };

  // plan 삭제
  const handleDeletePlace = async (planNo) => {
    if(planNo != null){
      const res = await planDel(planNo);
      navigate('/plans/list');
    }
  };

  // plan 공유
  const handleSharePlan = async (planNo) => {
    if(planNo != null){
      const res = await planShare(planNo);
      console.log(res.data);
      setShareLink(res.data); // API에서 받은 링크 저장
      setShareOpen(true);      // 모달 오픈
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!plan) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="text.secondary">
          일정을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* 여행 제목 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {plan.title}
        </Typography>
        <Box>
          {/* 상단 전체 수정/삭제 버튼 */}
          <Button variant="outlined" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleSharePlan(numericId)}>일정 공유</Button>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}  onClick={() => navigate(`/PlanForm/${id}`)}>수정</Button>
          <Button variant="outlined" color="error" size="small" onClick={() => handleDeletePlace(numericId)}>삭제</Button>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Event color="primary" />
        <Typography variant="body1">
          {plan.startDate} ~ {plan.endDate}
        </Typography>
      </Box>
      <Typography variant="body2" gutterBottom color="text.secondary">
        {plan.memo || '여행 설명이 없습니다.'}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Day별 일정 */}
      {days.map(d => (
        <Card key={d.day} sx={{ my: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Chip label={`Day ${d.day}`} color="primary" sx={{ mb: 2, fontWeight: 'bold' }} />
              <Button
                size="small"
                variant="outlined"
                startIcon={<Place />}
                sx={{ mb: 1 }}
                onClick={() => handleDayMapOpen(d.details, d.day)}
              >
                지도 보기
              </Button>

              {/* <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={() => handleDeleteDay(d.day)}
              >
                Day 삭제
              </Button> */}
            </Box>
            {d.details.length > 0 ? (
              d.details.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',  // 텍스트와 버튼 세로 중앙 정렬
                    justifyContent: 'space-between', // 좌우로 배치
                    p: 1,
                    mb: 1,
                    background: idx % 2 === 0 ? '#f0f7ff' : '#fff',
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{item.place}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.memo}</Typography>
                  </Box>
                  {/* <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => handleDeleteItem(d.day, idx)}
                  >
                    삭제
                  </Button> */}
                  
                </Box>

              ))
            ) : (
              <Typography variant="body2" color="text.secondary">등록된 장소가 없습니다.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
      {/* 공유 링크 모달 */}
      <Dialog open={shareOpen} onClose={() => setShareOpen(false)}>
        <DialogTitle>공유 링크</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={shareLink}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={handleCopy}>
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
          />
          {copied && <p style={{ color: 'green', marginTop: '8px' }}>복사되었습니다!</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)} color="secondary">닫기</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Day 지도</DialogTitle>
        <DialogContent style={{ height: '600px' }}>
          <MapView markers={mapMarkers} />
        </DialogContent>
      </Dialog>


    </Box>
  );
};

export default PlanDetail;
