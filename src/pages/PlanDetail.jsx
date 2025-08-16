import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Event, Place, AccessTime } from '@mui/icons-material';
import { planListOne } from '../services/authService';

const PlanDetail = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const [plan, setPlan] = useState(null);
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
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {plan.title}
      </Typography>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Event color="primary" />
        <Typography variant="body1">
          {plan.startDate} ~ {plan.endDate}
        </Typography>
      </Box>
      <Typography variant="body2" gutterBottom color="text.secondary">
        {plan.description || '여행 설명이 없습니다.'}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Day별 일정 */}
      {days.map(d => (
        <Card key={d.day} sx={{ my: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Chip label={`Day ${d.day}`} color="primary" sx={{ mb: 2, fontWeight: 'bold' }} />
            
            {d.details.length > 0 ? (
              d.details.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    mb: 1,
                    background: idx % 2 === 0 ? '#f0f7ff' : '#fff',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">{item.place}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.memo}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">등록된 장소가 없습니다.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PlanDetail;
