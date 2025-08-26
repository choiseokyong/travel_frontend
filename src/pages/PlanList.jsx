import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { planList } from '../services/authService';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [pageInfo, setPageInfo] = useState({ 
    page: 0, 
    size: 2,
    nowPage:0,
    keyword: '',
    sort: 1,
    totalPage: 0
  });
  const pageGroupSize = 2; // 한 번에 보여줄 버튼 수
const groupIndex = Math.floor(pageInfo.nowPage / pageGroupSize);
const start = groupIndex * pageGroupSize;
const end = Math.min(start + pageGroupSize, pageInfo.totalPage);
  
  const navigate = useNavigate();

  // fetchPlans: 특정 페이지 가져오기
  const fetchPlans = async (page = pageInfo.page) => {
    console.log(page);
    try {
      const res = await planList({ ...pageInfo, page });
      setPlans(res.data.planList);
      setPageInfo(res.data.pageInfo);
      console.log(res.data);
    } catch (err) {
      console.error('저장 실패', err);
    }
  };

  // 초기 1페이지 로드
  useEffect(() => {
    fetchPlans(0);
  }, []);

  return (
    <Box p={3} sx={{ minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 헤더 */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        ✈️ 내 여행 일정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        등록된 여행 일정 {plans.length}개
      </Typography>
      
      <Grid container spacing={4}>
        {plans.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              onClick={() => navigate(`/plans/${plan.no}`)}
              sx={{
                cursor: 'pointer',
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={plan.thumbnail || '/default-thumbnail.jpg'}
                alt={plan.title}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.startDate} ~ {plan.endDate}
                </Typography>

                <Box mt={1} mb={1}>
                  <Chip
                    label={plan.days ? `${plan.days}일 일정` : '여행'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                  {plan.memo || '여행 메모가 없습니다.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* 새 여행 추가 카드 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => navigate('/plans/new')}
            sx={{
              cursor: 'pointer',
              height: '100%',
              borderRadius: 3,
              border: '2px dashed #ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#888',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#1976d2',
                color: '#1976d2',
                background: '#f0f7ff',
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              + 새 여행 추가
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* 페이징 버튼 */}
      {pageInfo.totalPage > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={4}>
          {/* 이전 화살표 */}
          <Button
            variant="outlined"
            color="primary"
            disabled={pageInfo.nowPage <= 0}
            onClick={() => fetchPlans(pageInfo.nowPage - pageGroupSize)}
          >
            &lt;&lt;
          </Button>
          {/* 이전 화살표 */}
          <Button
            variant="outlined"
            color="primary"
            disabled={pageInfo.nowPage <= 0}
            onClick={() => fetchPlans(pageInfo.nowPage - 1)}
          >
            &lt;
          </Button>

          {/* 페이지 번호 */}
          {Array.from({ length: end - start }, (_, idx) => {
            const pageIdx = start + idx;
            return (
              <Button
                key={pageIdx}
                variant={pageInfo.nowPage === pageIdx ? "contained" : "outlined"}
                color="primary"
                onClick={() => fetchPlans(pageIdx)}
              >
                {pageIdx + 1}
              </Button>
            );
          })}

          {/* 다음 화살표 */}
          <Button
            variant="outlined"
            color="primary"
            disabled={pageInfo.nowPage >= pageInfo.totalPage - 1}
            onClick={() => fetchPlans(pageInfo.nowPage + 1)}
          >
            &gt;
          </Button>
          {/* 다음 화살표 */}
          <Button
            variant="outlined"
            color="primary"
            disabled={pageInfo.nowPage >= pageInfo.totalPage - 1}
            onClick={() => fetchPlans(Math.min(pageInfo.totalPage - 1, end))}
          >
            &gt;&gt;
          </Button>
        </Box>
      )}


    </Box>
  );
};

export default PlanList;
