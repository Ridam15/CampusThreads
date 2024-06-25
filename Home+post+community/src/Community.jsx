import Communities from "./pages/Communities"
import CommunityProfile from "./pages/CommunityProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Feed from "./CommunityComponents/communityProfile/Feed";
import "./Community.css";

export default function Community() {
    return (
        <Routes>
            <Route path="/" element={<Communities />} />
            <Route path="/CommunityProfile/:name" element={<CommunityProfile />} />
        </Routes>
    )
}