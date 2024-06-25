import { Avatar, Menu, MenuItem, IconButton, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import './Post.css';
import InputOption from '../ProfileComponents/InputOption';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Typography from "@mui/material/Typography";
// import header_img from "./header_pfp.png";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

function Post({ name, description, message, photoUrl, tags, numLikes, liked__alr, color, id, doubts, profilePicture, accountType }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(liked__alr);
  const [numOfLikes, setNumOfLikes] = useState(numLikes);
  const [likeColor, setLikeColor] = useState(color);
  const [isEditing, setIsEditing] = useState(false);
  const [postMessage, setPostMessage] = useState(JSON.parse(message));
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [postDetails, setPostDetails] = useState([]);
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Make a GET request to fetch posts
    // console.log(token);
    const fetchPostDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/post/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            // Add any additional headers as needed
          },
          body: JSON.stringify({ postId: id }), // Send postId to the backend
        });
        // console.log(response.json());

        if (response.ok) {
          const data = await response.json();
          console.log(data.data);
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

  for (let i = 0; i < postDetails.likes; i++) {
    if (postDetails.likes[i].user === localStorage.getItem("userId")) {
      setLiked(true);
      setLikeColor('#3480cd');
    }
  }

  const changeLikeButton = async () => {
    if (liked) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/post/unlike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({ postId: id }),
        });

        if (response.ok) {
          console.log('Post unliked successfully!');
        } else {
          console.error('Failed to unlike post');
        }
      } catch (error) {
        console.error('Error unliking post:', error);
        return;
      }
      setNumOfLikes(numOfLikes - 1);
      setLiked(false);
      setLikeColor('gray');
    } else {
      try {
        const response = await fetch('http://localhost:3000/api/v1/post/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({ postId: id }),
        });

        if (response.ok) {
          console.log('Post liked successfully!');
        } else {
          console.error('Failed to like post');
        }
      } catch (error) {
        console.error('Error liking post:', error);
        return;
      }
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
      //update the {message} with the one written in the text area
      setIsEditing(false);
      postDetails.content = updatedMessage;
      setPostMessage(updatedMessage);

      try {
        const response = await fetch('http://localhost:3000/api/v1/post/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            // Add any additional headers as needed
          },
          body: JSON.stringify({ postId: id, content: updatedMessage }), // Send postId to the backend
        });
        // console.log(response.json());

        if (response.ok) {
          const data = await response.json();
          console.log(data.data);
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
          {accountType == 'Professor' ? <PersonOutlinedIcon fontSize="small" /> : null}
        </div>
        {tags
          ? tags.map((tag, index) => (
            <span key={index} className="post__tag">
              {tag ? tag.name : null}
            </span>
          ))
          : null}
        {/* <p className='post__info__desc'>/{description}</p> */}
        {/* Add the dropdown button */}
        <div className="doubts_info">
          {doubts ? (
            <Typography variant="caption" className="post__doubtTag">
              Doubt
            </Typography>
          ) : null}
        </div>
        <div className="post__options">
          <IconButton
            aria-controls="post-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className="post__moreIcon"
            style={{ marginLeft: "20" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpdate}>{isEditing ? 'Save' : 'Update'}</MenuItem>
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

      <div className='post__buttons'>
        <div className='likeButton' onClick={changeLikeButton}>
          <InputOption Icon={liked ? ThumbUpIcon : ThumbUpAltOutlinedIcon} title={`  ${numOfLikes} Likes`} color={likeColor} />
        </div>
        <Link to='/CommentPage'>
          <InputOption Icon={SmsRoundedIcon} title='Comment' color='gray' />
        </Link>
      </div>
    </div>
  );
}

export default Post;

