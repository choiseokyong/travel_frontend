// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PlanForm from './pages/PlanForm';

function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/plans/new" element={<PlanForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
