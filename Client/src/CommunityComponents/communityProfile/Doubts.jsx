import React, { useState, useEffect } from "react";
import PostTemplate from "./PostTemplate.jsx";
import Post from "../../HomeAndPostComp/Post.jsx"

export default function Doubts({ communityName }) {
  const [doubts, setDoubts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `${apiUrl}/api/v1/community/getCommunityDoubts`,
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
          setDoubts(data.data);
        } else {
          console.error("Failed to fetch doubts");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchDoubts();
  }, [communityName]);

  const handleDelete = (doubtId) => {
    setDoubts((prevDoubts) =>
      prevDoubts.filter((doubt) => doubt.id !== doubtId)
    );
  };

  const handleUpdate = (doubtId, updatedMessage) => {
    setDoubts((prevDoubts) =>
      prevDoubts.map((doubt) =>
        doubt.id === doubtId ? { ...doubt, message: updatedMessage } : doubt
      )
    );
  };

  return (
    <div className="flex-[0.6]">
      {doubts && doubts.length > 0 ? (
        doubts.slice().reverse().map((doubt) => (
          <Post
            key={doubt._id}
            name={`${doubt.createdBy.firstName} ${doubt.createdBy.lastName}`}
            description={doubt.community ? doubt.community.name : "Deleted Community"}
            tags={doubt.tags}
            doubts={true}
            message={doubt.content}
            photoUrl={doubt.fileUrl}
            numLikes={doubt.likes.length}
            liked__alr={doubt.likes.includes(localStorage.getItem("userId"))}
            color={doubt.likes.includes(localStorage.getItem("userId")) ? '#3480cd' : 'gray'}
            id={doubt._id}
            profilePicture={doubt.createdBy.profilePicture} // Assuming the field is named profilePicture
          />
        ))
      ) : (
        <p>No doubts available.</p>
      )}
    </div>
  );
}
