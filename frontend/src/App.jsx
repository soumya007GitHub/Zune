import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Auth from './pages/Auth';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth" element={<Auth/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App