import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            여행 플래너
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          mt: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '60vh',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          padding: 4,
          boxShadow: 3,
        }}
      >
        <Box sx={{ alignSelf: 'flex-end', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/plans/new')}>
            + 새 일정 만들기
          </Button>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <EventNoteIcon sx={{ fontSize: 80, mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" gutterBottom>
            아직 만든 일정이 없습니다.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            새 일정을 만들어 여행 계획을 시작해보세요!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;
