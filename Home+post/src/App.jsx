import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// import PostPage from './PostPage';
import Home from './HomeAndPostComp/Home.jsx';
import CreatePost from './HomeAndPostComp/CreatePost.jsx';

import Profile from './Profile.jsx';
import Sign2 from './loginComp/Sign2.jsx';
import ContactUs from './HomeAndPostComp/ContactUs.jsx';

import './App.css';

function App() {

  return (


    <Router>
      <Routes>
        <Route path="/login/*" element={<Sign2 />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
      </Routes>
    </Router>


  )
}

export default App
