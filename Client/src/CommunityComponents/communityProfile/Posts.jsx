import React, { useState, useEffect } from "react";
// import PostTemplate from "./PostTemplate.jsx";
import Post from "../../HomeAndPostComp/Post";


export default function Posts({ communityName }) {
  const [posts, setPosts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `${apiUrl}/api/v1/community/getCommunityPosts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ name: communityName }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log(data.data);
          setPosts(data.data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPosts();
  }, [communityName]);

  const handleDelete = (postId) => {
    // Implement your delete logic here using the postId
  };

  const handleUpdate = (postId, updatedMessage) => {
    // Implement your update logic here using the postId and updatedMessage
  };

  return (
    <div className="flex-[0.6]">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            name={post.createdBy.firstName + " " + post.createdBy.lastName}
            description={communityName}
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
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}
