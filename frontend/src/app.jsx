import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// components & other files
import Test from './pages/Test';
import HeaderNav from './components/HeaderNav';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderNav />}>
          <Route path='test' element={<Test/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;