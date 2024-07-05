import React, { useState, useEffect } from 'react';
import Post from '../HomeAndPostComp/Post'; // Assuming Post component is defined in Post.jsx

function MyQuestions() {
    const [doubts, setDoubts] = useState([]);

    useEffect(() => {
        // Make a GET request to fetch posts
        const token = localStorage.getItem("Token");
        const fetchDoubts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/profile/getUserDoubts",
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
                    console.log(data2.data);
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
        <div className="my-questions">
            <h2 className="text-2xl font-semibold">My Questions</h2>
            {/* Add search and filter components here if needed */}
            <input
                type="text"
                placeholder="Search questions..."
                className="w-full p-2 border rounded mb-4"
            />
            <div className="filters mb-4">
                {/* Add filter components here */}
            </div>
            <ul className="space-y-4">
                {doubts.slice().reverse().map((doubt) => (
                    <Post
                        key={doubt._id}
                        name={`${doubt.createdBy.firstName} ${doubt.createdBy.lastName}`}
                        description={doubt.community ? doubt.community.name : "Deleted Community"}
                        tags={doubt.tags}
                        doubts={true}
                        message={doubt.content}
                        photoUrl={doubt.fileUrl}
                        numLikes={doubt.likes.length}
                        liked__alr={doubt.likes.some(like => like._id === localStorage.getItem("UserId")) ? true : false}
                        color={doubt.likes.some(like => like._id === localStorage.getItem("UserId")) ? '#3480cd' : 'gray'}
                        id={doubt._id}
                        profilePicture={doubt.createdBy.profilePicture}
                    // Assuming the field is named profilePicture
                    />
                ))}
            </ul>
        </div>
    );
}

export default MyQuestions;
