import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/profile/getUserDetails",
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

  // console.log(userData.coverPicture);

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <img src={userData.coverPicture} alt="" />

        <Link to="/Profile">
          <Avatar className="sidebar__avatar" src={userData.profilePicture} />
        </Link>
        <h2>{userData.firstName}</h2>
        <h4>{userData.email}</h4>
      </div>

      <div className="sidebar__stats">
        <div className="sidebar__stat">
          <p>No. of Contributions</p>
          <p className="sidebar__statNum">{userData.contribution} 156</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
