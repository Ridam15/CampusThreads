import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FriendsPage from './FriendsPage';
import MessagePage from './MessagePage';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const apiUrl = import.meta.env.VITE_API_URL;

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '6px 12px',
  textTransform: 'none',
  boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 5px 8px 2px rgba(0, 0, 0, 0.2)',
  },
}));

function Profilecomp({ onEditClick }) {
  const [userData, setUserData] = useState({});
  const [numberOfFriends, setNumberOfFriends] = useState(0);
  const [isFriendsPageOpen, setFriendsPageOpen] = useState(false);
  const [isMessagePageOpen, setMessagePageOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-render
  const [isDialogOpen, setDialogOpen] = useState(false); // State for dialog open
  const navigate = useNavigate();

  const handleFriendsClick = () => {
    setFriendsPageOpen(true);
  };

  const handleMessageClick = () => {
    setMessagePageOpen(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch(`${apiUrl}/api/v1/profile/deleteProfile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      });

      if (response.ok) {
        alert('Profile deleted successfully.');
        navigate('/login'); // Redirect to login or home page after deletion
      } else {
        const errorData = await response.json();
        alert('Error deleting profile: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile. Please try again later.');
    }
  };

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      handleDelete();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/profile/getUserDetails`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching user details. Please try again later.');
      }
    };

    const fetchFriendsData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/friends/getallFriends`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();
        setNumberOfFriends(data.data.length); // Assuming the friends data is an array
      } catch (error) {
        console.error('Error fetching friends data:', error);
        alert('Error fetching friends data. Please try again later.');
      }
    };

    fetchUserData();
    fetchFriendsData();
  }, [refresh]); // Adding refresh as a dependency to re-fetch data when it changes

  const formatDOB = (dob) => {
    if (dob && dob.additionalDetails && dob.additionalDetails.dateOfBirth) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dob.additionalDetails.dateOfBirth).toLocaleDateString(undefined, options);
    }
    return '';
  };

  return (
    <div className="relative">
      <div>
        <img
          src={userData.coverPicture ? userData.coverPicture : 'https://images.pexels.com/photos/13095812/pexels-photo-13095812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          className="mt-4 mb-4 rounded-xl w-full px-48 h-44 object-cover "
          alt="ProfileCoverPage"
        />
      </div>
      <div className="flex mr-0">
        <div className="ml-48 mt-4 pl-4 mr-5">
          <div className="flex justify-start items-center space-x-16">
            <img src={userData.profilePicture}
              className="flex justify-start items-center space-x-16 ml-10 w-32 h-32 bg-blue-100 rounded-full border-2 border-2xl border-black"
              alt="ProfilePicture"
            />
          </div>
          <div className="flex justify-start items-center space-x-6 mt-4">
            <span
              className="text-light-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
              onClick={handleFriendsClick}
            >
              <i className="fas fa-user-friends fa-sm mr-2 text-light-blue-600 hover:text-blue-800" />
              <span className={`font-bold text-lg ${isFriendsPageOpen ? 'animate-fadeIn' : ''}`}>{numberOfFriends} Friends</span>
            </span>

            <a href="#" className="text-light-blue-600 hover:text-light-blue-900 flex items-center">
              <i className="fas fa-award fa-sm mr-2 text-light-blue-600 hover:text-light-blue-900" />
              <span className="font-bold text-lg"> 156 Contributions</span>
            </a>
          </div>
        </div>

        <div className="flex w-2/5 justify-between ml-0 ">
          <div className="flex w-5/10 flex-col mr-0">
            <div className="flex justify-between ">
              <p className="ml-0 pt-4 font-semibold text-2xl">{userData.firstName} {userData.lastName}
                {userData.accountType === 'student' ? <EmojiPeopleIcon className="mt-1" /> : <PersonOutlinedIcon fontSize="small" />}
              </p>
            </div>
            {userData.additionalDetails?.dateOfBirth && (
              <div className="ml-0 mt-2 text-xl">Date of Birth : {formatDOB(userData)}</div>
            )}
            {userData.additionalDetails?.collegeName &&
              <div className="ml-0 mt-2 text-xl mr-10">
                <SchoolIcon className="mr-2" /> College : {userData.additionalDetails?.collegeName}
              </div>
            }
            {userData.additionalDetails?.collegeBranch &&
              <div className="ml-0 mt-2 text-xl items-center">
                <EngineeringIcon className="mr-2" /> Branch : {userData.additionalDetails?.collegeBranch}
              </div>
            }
          </div>
          <div className="flex flex-wrap justify-start items-center space-x-6 mt-5">
            <StyledButton
              variant="contained"
              color="primary"
              size="small"
              onClick={onEditClick}
              sx={{ bgcolor: '#64B5F6', color: 'white' }}
            >
              Edit Profile
            </StyledButton>
            <StyledButton
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleDeleteClick}
              sx={{ bgcolor: '#EF5350', color: 'white' }}
            >
              Delete Profile
            </StyledButton>
            <StyledButton
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleMessageClick}
              sx={{ bgcolor: '#FFB74D', color: 'white' }}
            >
              Message
            </StyledButton>
          </div>
        </div>
      </div>

      {isFriendsPageOpen && (
        <FriendsPage
          firstName={userData.firstName}
          onClose={() => {
            setFriendsPageOpen(false);
            setRefresh(prev => !prev); // Trigger a re-render by toggling the refresh state
          }}
        />
      )}
      {isMessagePageOpen && (
        <MessagePage
          firstName={userData.firstName}
          onClose={() => {
            setMessagePageOpen(false);
            setRefresh(prev => !prev); // Trigger a re-render by toggling the refresh state
          }}
        />
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => handleDialogClose(false)}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Profilecomp;
