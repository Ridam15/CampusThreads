import React from 'react'
import './CommentPage.css'
import header_img from "./header_pfp.png";
import { Avatar } from '@mui/material'
import { Link } from 'react-router-dom';
import InputOption from './InputOption.jsx';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useState } from 'react';
import Comments from './CommentComponents/Comments.jsx';

function CommentPage() {

  const [liked, setLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [likeColor, setLikeColor] = useState('gray');

  const changeLikeButton = () => {
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

  return (
    <div className='commentPage__container'>
      <div className='commentPage__post'>
        <div className='commentPage__post__header'>
          <Avatar src={header_img} className='post__avatar' />
          <div className='post__info'>
            <h2>Jeel Viradiya</h2>
            <div className='post__info__desc'>
              {/* {tags ? tags.map((tag, index) => (
                <span key={index} className='post__tag'>{tag ? tag.name : null}</span>
              )) : null} */}
              <p className='post__info__desc'>/General</p>
            </div>
          </div>
        </div>

        <div className='commentPage__post__body'>
          {/* <img src={photoUrl} alt='Post' className='post__image' /> */}
          <p>Hello, My name is jeel.</p>
        </div>

        <div className='commentPage__post__buttons'>
          <div className='likeButton' onClick={changeLikeButton}>
            <InputOption Icon={liked ? ThumbUpIcon : ThumbUpAltOutlinedIcon} title={`${numOfLikes} Likes`} color={likeColor} />
          </div>
        </div>

        <Comments
          currentUserId="1"
        />
      </div>
    </div>
  )
}

export default CommentPage
