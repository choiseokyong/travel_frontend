// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlanForm from './pages/PlanForm';

function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans/new" element={<PlanForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
