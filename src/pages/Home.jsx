import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      

      {/* 메인 Hero 섹션 */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#e1f5fe', // 밝은 하늘색 배경
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            textAlign: 'center',
          }}
        >
          <TravelExploreIcon sx={{ fontSize: 100, color: '#29b6f6', mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem' },
              color: '#0288d1', // 선명한 파랑
            }}
          >
            나만의 여행 일정을 쉽게 계획하세요!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: '#039be5', // 밝은 청록색 계열
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            여행지를 추가하고, 날짜를 선택하고, 계획을 저장해보세요.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontSize: '1rem',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              bgcolor: '#ffb74d', // 밝은 오렌지톤
              color: '#212121',
              ':hover': {
                bgcolor: '#ffa726',
                color: '#fff',
              },
            }}
            onClick={() => navigate('/plans/new')}
          >
            지금 일정 만들기
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
