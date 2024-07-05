import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@mui/material";
import InputOption from "./InputOption";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";

export default function PostTemplate({
  id,
  name,
  message,
  profileImg,
  photoUrl,
  onDelete,
  onUpdate,
  tags,
  likes,
  comments,
}) {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [liked, setLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(likes);
  const [likeColor, setLikeColor] = useState("gray");

  const handleUpdateClick = () => {
    setOptionsVisible(false);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked");
    if (onDelete) {
      onDelete();
    }
  };

  const changeLikeButton = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        setLiked(true);
        setNumOfLikes(numOfLikes + 1);
        setLikeColor("#3480cd");
      } else {
        console.error('Failed to like the post');
      }
    } catch (error) {
      console.error('Error while liking the post:', error);
    }
  };

  const changeUnlikeButton = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch('https://campusconnectbackend.onrender.com/api/v1/post/unlike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        setLiked(false);
        setNumOfLikes(numOfLikes - 1);
        setLikeColor("gray");
      } else {
        console.error('Failed to unlike the post');
      }
    } catch (error) {
      console.error('Error while unliking the post:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isOptionsVisible || isEditing) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setOptionsVisible(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOptionsVisible, isEditing]);

  const handleThreeDotsClick = (event) => {
    event.stopPropagation();
    setOptionsVisible(!isOptionsVisible);
  };

  const handleUpdate = () => {
    onUpdate(updatedMessage);
    setIsEditing(false);
  };

  return (
    <div className="w-[100%] h-auto mt-[30px] border-[1px] border-solid rounded-[7px] flex flex-col relative">
      <div className="absolute top-0 right-0 mt-2 mr-2">
        <button
          className="text-gray-500 focus:outline-none"
          onClick={handleThreeDotsClick}
        >
          <span className="text-xl">&#8942;</span>
        </button>
        {isOptionsVisible && (
          <div
            ref={optionsRef}
            className="absolute top-0 right-0 mt-8 mr-2 bg-white border border-gray-200 p-2 rounded flex flex-col options-container"
          >
            <button
              className="text-blue-500 focus:outline-none hover:bg-blue-100 px-2 py-1 rounded"
              onClick={handleUpdateClick}
            >
              Edit
            </button>
            <button
              className="text-red-500 focus:outline-none hover:bg-red-100 px-2 py-1 rounded mt-2"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-[white] p-[15px] rounded-[10px]">
        <div className="flex items-center m-2.5">
          <Avatar src={profileImg} className="h-[35px] w-[35px]" />
          <div className="flex flex-col ml-2.5">
            <h2 className="text-base mt-0">{name}</h2>
          </div>
        </div>

        <div className="m-2.5">
          {tags ? tags.map((tag, index) => (
            <span key={index} className='inline-block bg-[#e0e0e0] text-xs text-[#333] mr-[5px] px-2.5 py-[5px] rounded-lg'>{tag ? tag.name : null}</span>
          )) : null}
        </div>

        <div>
          {isEditing ? (
            <textarea
              value={updatedMessage}
              onChange={(e) => setUpdatedMessage(e.target.value)}
              className="w-full mb-2"
            />
          ) : (
            <p className="mx-2.5">{message}{photoUrl ? <img src={photoUrl} alt='Post' className='post__image' /> : null}</p>
          )}
        </div>

        <div className="flex justify-evenly">
          <div onClick={liked ? changeUnlikeButton : changeLikeButton}>
            <InputOption
              Icon={liked ? ThumbUpIcon : ThumbUpAltOutlinedIcon}
              title={`${numOfLikes} Likes`}
              color={likeColor}
            />
          </div>
          <div>
            <InputOption Icon={SmsRoundedIcon} title="Comment" color="gray" />
          </div>
        </div>

        {isEditing && (
          <button onClick={handleUpdate} className="text-blue-500 mt-2">
            Save
          </button>
        )}
      </div>
    </div>
  );
}
