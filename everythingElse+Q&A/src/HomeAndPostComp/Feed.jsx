import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import InputOption from '../ProfileComponents/InputOption';
import ImageIcon from "@mui/icons-material/Image";
import { Link } from "react-router-dom";
import Post from "./Post.jsx";
import "./Feed.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles for react-quill


function Feed() {
  const [posts, setPosts] = useState([]);
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch posts
    const token = localStorage.getItem("Token");
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/post/getAllPosts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPosts(data.data);
          // console.log(posts.likes.includes(localStorage.getItem("UserId")));
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Make a GET request to fetch posts
    const token = localStorage.getItem("Token");
    const fetchDoubts = async () => {
      try {
        const response = await fetch(
          "",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.ok) {
          const data2 = await response.json();
          setDoubts(data2.data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchDoubts();
  }, []);

  return (
    <div className="w-[45%] mx-[5%]">
      <div className="bg-white p-4 pb-20 rounded-10 mb-4 mt-5 h-32">
        <div className="flex border border-lightgray rounded-30 text-gray pl-15 h-[5vh]">
          <div className="ml-[2vh]">
            <CreateIcon />
          </div>
          <form className="flex w-full justify-center items-center">
            <button id="startPostButton" className="w-[70%] border-none rounded-10 bg-[#f3f2ef] text-gray">
              <Link to="/CreatePost" className="no-underline">
                Start a post
              </Link>
            </button>
          </form>
        </div>
        <div className="flex justify-evenly mt-[2%]">
          <Link to="/CreatePost" className="no-underline">
            <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9" />
          </Link>
        </div>
      </div>

      {posts.slice().reverse().map((post) => (
        <Post
          key={post._id}
          name={post.createdBy.firstName + " " + post.createdBy.lastName}
          description={
            post.community ? post.community.name : "Deleted Community"
          }
          tags={post.tags}
          message={post.content}
          photoUrl={post.fileUrl}
          numLikes={post.likes.length}
          liked__alr={post.likes.some(like => like._id === localStorage.getItem("UserId")) ? true : false}
          color={post.likes.some(like => like._id === localStorage.getItem("UserId")) ? '#3480cd' : 'gray'}
          id={post._id}
          profilePicture={post.createdBy.profilePicture}
          accountType={post.createdBy.accountType}
        />
      ))}
      {/* {doubts
        ? doubts.map((doubts) => (
          <Post
            key={doubts._id}
            name={
              doubts.createdBy.firstName + " " + doubts.createdBy.lastName
            }
            description={
              doubts.community ? doubts.community.name : "Deleted Community"
            }
            tags={doubts.tags}
            doubts={true}
            message={doubts.content}
            photoUrl={doubts.fileUrl}
            numLikes={doubts.likes.length}
            liked__alr={doubts.likes.includes(localStorage.getItem("userId")) ? true : false}
            color={doubts.likes.includes(localStorage.getItem("userId")) ? '#3480cd' : 'gray'}
            id={doubts._id}
            profilePicture={doubts.createdBy.profilePicture} // Assuming the field is named photoUrl
          />
        ))
        : null} */}
      {/* <Post
        name="Ridam Chhapiya"
        // tags="Competitve Programmer"
        description="DAIICT'25"
        message="Hello everyone, My name is Ridam and I am a student of Daiict."
      />
      <Post
        name="Deven Patel"
        // tags="Competitve Programmer"
        description="DAIICT'25"
        message="Hello everyone, My name is Deven and I am a student of Daiict."
      />
      <Post
        name="Ridam Chhapiya"
        // tags="Competitve Programmer"
        description="DAIICT'25"
        message="Hello everyone, My name is Ridam and I am a student of Daiict."
      />
      <Post
        name="Deven Patel"
        // tags="Competitve Programmer"
        description="DAIICT'25"
        message="Hello everyone, My name is Deven and I am a student of Daiict."
      /> */}
    </div>
  );
}

export default Feed;
