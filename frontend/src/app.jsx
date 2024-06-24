import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// components & other files
import Test from './pages/Test';
import HeaderNav from './components/HeaderNav';
import Dashboard from './pages/Dashboard';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderNav />}>
          <Route index element={<Navigate to='/dashboard' />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='test' element={<Test/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;