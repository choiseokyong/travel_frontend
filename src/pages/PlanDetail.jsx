import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent } from '@mui/material';
import axios from 'axios';
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
    }
    fetchPlans();
  }, [numericId]);

  if (!plan) {
    return <Typography>일정을 불러오는 중...</Typography>;
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>{plan.title}</Typography>
      <Typography variant="body1">
        {plan.startDate} ~ {plan.endDate}
      </Typography>
      <Typography variant="body2" gutterBottom color="text.secondary">
        {plan.description}
      </Typography>

      {plan.days && plan.days.map((day, index) => (
        <Card key={index} sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6">Day {index + 1}</Typography>
            {day.places && day.places.map((place, idx) => (
              <Typography key={idx} variant="body2">
                - {place.name} ({place.time})
              </Typography>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PlanDetail;
