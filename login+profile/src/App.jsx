import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// import PostPage from './PostPage';
// import Home from './Home.jsx';
import Profile from './Profile.jsx';
import Sign2 from './loginComp/Sign2.jsx';
import './App.css';

function App() {

  return (


    <Router>
      <Routes>
        <Route path="/login/*" element={<Sign2 />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/Profile" element={<Profile />} />
        {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
      </Routes>
    </Router>


  )
}

export default App
