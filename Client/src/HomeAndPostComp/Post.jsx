import { Avatar, Menu, MenuItem, IconButton, TextareaAutosize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Post.css';
import InputOption from '../ProfileComponents/InputOption';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Typography from "@mui/material/Typography";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CommentModal from './commentModal';

const apiUrl = import.meta.env.VITE_API_URL;

function Post({ name, description, message, photoUrl, tags, numLikes, liked__alr, color, id, doubts, profilePicture, accountType, userId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(liked__alr);
  const [numOfLikes, setNumOfLikes] = useState(numLikes);
  const [likeColor, setLikeColor] = useState(color);
  const [isEditing, setIsEditing] = useState(false);
  const [postMessage, setPostMessage] = useState(JSON.parse(message));
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [postDetails, setPostDetails] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem("Token");
  // const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(getApiUrl('details'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(doubts ? { doubtId: id } : { postId: id }),
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(data.data);
          setPostDetails(data.data);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchPostDetails();
  }, []);

  const getApiUrl = (action) => {
    const baseUrl = `${apiUrl}/api/v1/`;
    const endpoint = doubts ? 'doubt/' : 'post/';
    return baseUrl + endpoint + action;
  };

  useEffect(() => {
    if (postDetails && postDetails.likes) {
      for (let i = 0; i < postDetails.likes.length; i++) {
        if (postDetails.likes[i]._id === userId) {
          setLiked(true);
          setLikeColor('#3480cd');
          break;
        }
      }
    }
  }, [postDetails, userId]);

  const changeLikeButton = async () => {
    const action = liked ? 'unlike' : 'like';
    try {
      const response = await fetch(getApiUrl(action), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(doubts ? { doubtId: id } : { postId: id }),
      });

      if (response.ok) {
        console.log(`Post ${action}d successfully!`);
      } else {
        console.error(`Failed to ${action} post`);
      }
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      return;
    }

    if (liked) {
      setNumOfLikes(numOfLikes - 1);
      setLiked(false);
      setLikeColor('gray');
    } else {
      setNumOfLikes(numOfLikes + 1);
      setLiked(true);
      setLikeColor('#3480cd');
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = async () => {
    if (isEditing) {
      setIsEditing(false);
      postDetails.content = updatedMessage;
      setPostMessage(updatedMessage);

      try {
        const response = await fetch(getApiUrl('update'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(doubts ? { doubtId: id, content: updatedMessage } : { postId: id, content: updatedMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(data.data);
        } else {
          console.error('Failed to update post');
        }
      } catch (error) {
        console.error('Error during update:', error);
      }

      handleClose();
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await fetch(getApiUrl('delete'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(doubts ? { doubtId: id } : { postId: id }),
      });

      if (response.ok) {
        console.log('Post deleted successfully!');
        // Optionally, you can remove the post from the UI here
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }

    handleDialogClose();
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar src={profilePicture} className="post__avatar" />
        <div className="post__info">
          <h2>{name}</h2>
          <div className='post__info__desc m-0'>
            <p className='post__info__desc m-0'>/{description}</p>
          </div>
        </div>
        <div>
          {accountType === 'Professor' ? <PersonOutlinedIcon fontSize="small" /> : null}
        </div>
        {tags
          ? tags.map((tag, index) => (
            <span key={index} className="post__tag">
              {tag ? tag.name : null}
            </span>
          ))
          : null}
        <div className="doubts_info">
          {doubts ? (
            <Typography variant="caption" className="post__doubtTag">
              Doubt
            </Typography>
          ) : null}
        </div>
        <div className="post__options">
          {userId === postDetails.createdBy?._id && (
            <IconButton
              aria-controls="post-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className="post__moreIcon"
              style={{ marginLeft: "20" }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* {userId === postDetails.createdBy?._id && (
              <MenuItem onClick={handleUpdate}>{isEditing ? 'Save' : 'Update'}</MenuItem>
            )} */}
            {userId === postDetails.createdBy?._id && (
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            )}
          </Menu>
        </div>
      </div>

      <div className='post__body'>
        {isEditing ? (
          <TextareaAutosize
            value={updatedMessage}
            onChange={(e) => setUpdatedMessage(e.target.value)}
          />
        ) : (
          <ReactQuill
            value={postMessage}
            readOnly={true}
            theme="bubble"
            className="custom-quill"
          />
        )}
      </div>

      <div className='post__buttons flex items-center'>
        <div className='likeButton mt-4' onClick={changeLikeButton}>
          <InputOption Icon={liked ? ThumbUpIcon : ThumbUpAltOutlinedIcon} title={`  ${numOfLikes} Likes`} color={likeColor} />
        </div>
        {!doubts && (
          <div className='mt-4' onClick={handleModalOpen}>
            <InputOption Icon={SmsRoundedIcon} title='Comment' color='gray' />
          </div>
        )}
      </div>

      <CommentModal
        post={{ id, name, description, accountType, tags, message, profilePicture, comments: postDetails.comments || [] }}
        open={modalOpen}
        handleClose={handleModalClose}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm to delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Post;
