import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { planList } from '../services/authService';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const res = await planList();
            setPlans(res.data);
            console.log('저장 성공', res.data);
        } catch (err) {
            console.error('저장 실패', err);
        }
    }
   fetchPlans();
  }, []);

  if (plans.length === 0) {
    return <Typography>등록된 여행 일정이 없습니다.</Typography>;
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {plans.map(plan => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              onClick={() => navigate(`/plans/${plan.no}`)}
              sx={{ cursor: 'pointer', height: '100%' }}
            >
              <CardMedia
                component="img"
                height="160"
                image={plan.thumbnail || '/default-thumbnail.jpg'}
                alt={plan.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.startDate} ~ {plan.endDate}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {plan.description || '여행 메모가 없습니다.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlanList;
