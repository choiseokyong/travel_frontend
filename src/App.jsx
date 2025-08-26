// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PlanForm from './pages/PlanForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlanList from './pages/PlanList';
import PlanDetail from './pages/PlanDetail';
import ProtectedRoute from './components/ProtectedRoute';
import SharedPlanPage from './pages/SharedPlanPage';
import MyPage from './pages/MyPage';
import MapSearchPage from './pages/MapSearchPage';


function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/plans/share/:uuid" element={<SharedPlanPage />} />
        <Route path="/map-search" element={<MapSearchPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/plans/list" element={<PlanList />} />
            <Route path="/plans/:id" element={<PlanDetail />} />
            <Route path="/plans/new" element={<PlanForm />} />
            <Route path="/planForm/:id" element={<PlanForm />} />
            <Route path="/users/mypage" element={<MyPage />} />
            
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
