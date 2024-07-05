import React, { useState, useEffect } from "react";
import PostTemplate from "./PostTemplate.jsx";

export default function Doubts({ communityName }) {
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          "",
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
          console.log(data.data);
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
        doubts.map((doubt) => (
          <PostTemplate
            key={doubt._id}
            id={doubt._id}
            name={doubt.createdBy.firstName + " " + doubt.createdBy.lastName}
            profileImg={doubt.createdBy.profilePicture}
            tags={doubt.tags}
            message={doubt.content}
            photoUrl={doubt.fileUrl}
            likes={doubt.likes.length}
            onDelete={() => handleDelete(doubt.id)}
            onUpdate={(updatedMessage) => handleUpdate(doubt.id, updatedMessage)}
          />
        ))
      ) : (
        <p>No doubts available.</p>
      )}
    </div>
  );
}
