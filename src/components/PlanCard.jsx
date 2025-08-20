// // src/components/PlanCard.jsx
// import React from 'react';
// import {
//   Card, CardContent, Typography,
//   Stack, Button
// } from '@mui/material';

// const PlanCard = ({ plan, onView, onDelete }) => (
//   <Card sx={{ mb: 2 }}>
//     <CardContent>
//       <Typography variant="h6">{plan.title}</Typography>
//       <Typography color="text.secondary">
//         {plan.startDate} ~ {plan.endDate}
//       </Typography>
//       <Typography variant="body2">{plan.memo}</Typography>
//       <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
//         <Button variant="contained" size="small" onClick={onView}>상세 보기</Button>
//         <Button variant="outlined" size="small" color="error" onClick={onDelete}>삭제</Button>
//       </Stack>
//     </CardContent>
//   </Card>
// );

// export default PlanCard;
