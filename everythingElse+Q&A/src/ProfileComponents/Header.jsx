// Header.jsx

import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import HeaderOption from './HeaderOption';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Avatar, Menu, MenuItem, IconButton, CircularProgress, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import logo from "./img.jpg";
import { Link, useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function Header() {
  const [picture, setPicture] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // State for menu anchor
  const [friendsList, setFriendsList] = useState([]);

  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Token");

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/profile/getUserDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        const data = await response.json();
        setPicture(data.data.profilePicture);
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details. Please try again later.');
      }
    };

    // Fetch friends list
    const fetchFriendsList = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/friends/getAllFriends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        const data = await response.json();
        setFriendsList(data.data);
      } catch (error) {
        console.error('Error fetching friends list:', error);
        alert('Error fetching friends list. Please try again later.');
      }
    };

    // Fetch sent requests
    const fetchSentRequests = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/friends/getallreqsent', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setSentRequests(data.data);
        } else {
          console.error('Failed to fetch sent requests:', data.message);
        }
      } catch (error) {
        console.error('Error fetching sent requests:', error);
      }
    };

    fetchUserDetails();
    fetchFriendsList();
    fetchSentRequests();
  }, []);

  const handleSearchInputChange = async (event) => {
    const token = localStorage.getItem("Token");
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/search/searchuser/${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        const data = await response.json();
        if (data.success) {
          const loggedInUserId = localStorage.getItem('UserId');
          const filteredResults = data.data.filter(result => result._id !== loggedInUserId);
          const markedResults = filteredResults.map(result => ({
            ...result,
            isFriend: friendsList.some(friend => friend.id === result._id),
            sentRequest: sentRequests.some(request => request.id === result._id)
          }));

          setSearchResults(markedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch(`http://localhost:3000/api/v1/friends/sendreq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        // Refresh friends list after sending request
        const friendsResponse = await fetch('http://localhost:3000/api/v1/friends/getAllFriends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        const friendsData = await friendsResponse.json();
        setFriendsList(friendsData.data);

        // Update sent requests list
        setSentRequests(prevRequests => [...prevRequests, { _id: userId }]);

        // Update search results to mark the user as sentRequest
        setSearchResults(prevResults =>
          prevResults.map(result => {
            if (result._id === userId) {
              return { ...result, sentRequest: true };
            }
            return result;
          })
        );
      } else {
        console.error('Failed to send friend request:', data.message);
        alert('Failed to send friend request. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Error sending friend request. Please try again later.');
    }
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem('Token');
    navigate('../');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="header__left">
        <img src={logo} alt="abc" />
        <div className="relative p-2.5 flex items-center rounded-md h-5 mt-7 text-gray-500 bg-gray-200 w-2/5 cursor-pointer">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by User"
            className="ml-2 bg-transparent outline-none"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {loading && <CircularProgress size={20} className="ml-2" />}
          {searchResults.length > 0 && (
            <div ref={searchResultsRef} className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md z-10 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200">
                  <Link to={`../userProfile/${result._id}`} className="flex items-center">
                    <Avatar src={result.profilePicture} alt={`${result.firstName} ${result.lastName}`} />
                    <span className="ml-2">{result.firstName} {result.lastName}</span>
                  </Link>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={result.sentRequest ? <CheckIcon /> : <PersonAddIcon />}
                    onClick={() => handleSendFriendRequest(result._id)}
                    disabled={result.isFriend || result.sentRequest}
                    className={`rounded-full text-xs px-2 py-1 ${result.isFriend || result.sentRequest ? 'opacity-50' : ''}`}
                  >
                    {result.isFriend ? 'Friend' : result.sentRequest ? 'Sent' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          )}
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
          <Link to="/Q&A">
            <HeaderOption Icon={QuestionAnswerIcon} title="Q&A" />
          </Link>
        </div>

        <div className="header__right__profile">
          <Link to="/Profile">
            <HeaderOption avatar={picture} title="Profile" />
          </Link>
        </div>

        <div className="header__right__more">
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogOut}>
              <ExitToAppIcon className="mr-2" /> Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Header;

