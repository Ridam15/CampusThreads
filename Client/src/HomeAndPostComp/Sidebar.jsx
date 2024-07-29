import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/profile/getUserDetails`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();
        setUserData(data.data);
        localStorage.setItem("ProfilePicture", data.data.profilePicture);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <img src={userData.coverPicture} alt="" />

        <Avatar
          sx={{ width: 70, height: 70 }} // Increase size of the Avatar
          className="sidebar__avatar"
          onClick={() => navigate("/Profile")}
          src={userData.profilePicture}
        />
        <h2>{userData.firstName}</h2>
        <h4>{userData.email}</h4>
      </div>

      <div className="sidebar__stats">
        <div className="sidebar__stat">
          <p>No. of Contributions</p>
          <p className="sidebar__statNum">{userData.contribution} 15</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
