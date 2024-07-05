import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Home from './HomeAndPostComp/Home.jsx';
import CreatePost from './HomeAndPostComp/CreatePost.jsx';
import Community from './Community.jsx';
import Profile from './Profile.jsx';
import Sign2 from './loginComp/Sign2.jsx';
import ContactUs from './HomeAndPostComp/ContactUs.jsx';
import QandA from './Q&APages/Q&A.jsx';
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
        <Route path="/Q&A/*" element={<QandA />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Community/*" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;
