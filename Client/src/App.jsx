import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import Home from './HomeAndPostComp/Home.jsx';
import CreatePost from './HomeAndPostComp/CreatePost.jsx';
import Community from './Community.jsx';
import Profile from './Profile.jsx';
import Sign2 from './loginComp/Sign2.jsx';
import ContactUs from './HomeAndPostComp/ContactUs.jsx';
import QandA from './Q&APages/Q&A.jsx';
import Profilecomp from './ProfileComponents/otherProfile.jsx'; // Import the Profilecomp component
import './App.css';
import CreateDoubt from "./Q&APages/CreateDoubt.jsx";

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
        <Route path="/Q&A/CreateDoubt" element={<CreateDoubt />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/Community/*" element={<Community />} />
        <Route path="/userprofile/:userid" element={<UserProfile />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

// Define a functional component for UserProfile to fetch user ID from params
const UserProfile = () => {
  const { userid } = useParams(); // Extract userid from params using useParams hook
  return <Profilecomp userid={userid} />; // Pass userid as a prop to Profilecomp
};

export default App;
