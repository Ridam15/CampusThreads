import { React, useState } from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';
import HeaderOption from './HeaderOption';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import logo from "./img.jpg";

import { Link, useNavigate } from "react-router-dom";
import header_img from "./header_pfp.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function Header() {
  const profilePicture = localStorage.getItem("ProfilePicture");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    // Add your update logic here
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

        {/* <div className="header__right__messages">
          <HeaderOption Icon={ChatIcon} title="Messages" />
        </div> */}

        <div className="header__right__profile">
          <Link to="/Profile">
            <HeaderOption avatar={profilePicture} title="Profile" />
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

function DropDownItem({ menuItem }) {
  return (
    <li className="dropDownItem">
      <ExitToAppIcon className="exit__icon" />
      <a href="#" className="menuItem">
        {menuItem}
      </a>
    </li>
  );
}

export default Header;
