import { React, useEffect, useState } from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';
import HeaderOption from './HeaderOption';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Import QuestionAnswerIcon
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import logo from "./img.jpg";

import { Link, useNavigate } from "react-router-dom";
import header_img from "./header_pfp.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function Header() {
  const [picture, setPicture] = useState('');
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/profile/getUserDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();

        console.log(data.data.profilePicture);
        setPicture(data.data.profilePicture);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching user details. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // const profilePicture = localStorage.getItem('ProfilePicture');
  // console.log(profilePicture);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem('Token');
    navigate('../');
  };

  return (
    <div className="header">
      <div className="header__left">
        <img src={logo} alt="abc" />
        <div className="header__search">
          <SearchIcon />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="header__right">
        <div className="header__right__home">
          <Link to="/Home">
            <HeaderOption Icon={HomeIcon} title="Home" />
          </Link>
        </div>

        <div className="header__right__community">
          <Link to="/Community">
            <HeaderOption Icon={GroupsIcon} title="Community" />
          </Link>
        </div>

        <div className="header__right__qa">
          <Link to="/QandA">
            <HeaderOption Icon={QuestionAnswerIcon} title="Q&A" />
          </Link>
        </div>

        <div className="header__right__profile">
          <Link to="/Profile">
            <HeaderOption avatar={picture} title="Profile" />
          </Link>
        </div>

        <div className='menu__options'>
          <IconButton
            aria-controls="post-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className='post__moreIcon'
            style={{ marginLeft: '20' }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Header;
