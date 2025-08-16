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
      {plan.item && plan.item.map((day, index) => (
        <Card
          key={index}
          sx={{
            my: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent>
            <Chip
              label={`Day ${index + 1}`}
              color="primary"
              sx={{ mb: 2, fontWeight: 'bold' }}
            />
            {day.places && day.places.length > 0 ? (
              <List>
                {day.places.map((place, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      background: idx % 2 === 0 ? '#f0f7ff' : '#fff',
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <Place color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="bold">
                          {place.name}
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTime fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {place.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                등록된 장소가 없습니다.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PlanDetail;
