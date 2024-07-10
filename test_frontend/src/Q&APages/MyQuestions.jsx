import React, { useState, useEffect } from 'react';
import Post from '../HomeAndPostComp/Post'; // Assuming Post component is defined in Post.jsx
import { Typography, TextField, Button, Modal, Box, Divider } from '@mui/material';

function MyQuestions() {
    const [doubts, setDoubts] = useState([]);

    useEffect(() => {
        const fetchDoubts = async () => {
            const token = localStorage.getItem("Token");
            try {
                const response = await fetch("http://localhost:3000/api/v1/profile/getUserDoubts", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });

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
                    <div key={doubt._id} className="mb-4">
                        <Post
                            name={`${doubt.createdBy.firstName} ${doubt.createdBy.lastName}`}
                            description={doubt.community ? doubt.community.name : "Deleted Community"}
                            tags={doubt.tags}
                            doubts={true}
                            message={doubt.content}
                            photoUrl={doubt.fileUrl}
                            numLikes={doubt.likes.length}
                            liked__alr={doubt.likes.some(like => like._id === localStorage.getItem("UserId"))}
                            color={doubt.likes.some(like => like._id === localStorage.getItem("UserId")) ? '#3480cd' : 'gray'}
                            id={doubt._id}
                            profilePicture={doubt.createdBy.profilePicture}
                        />
                        <Typography variant="h6" sx={{ mt: 2, ml: 2 }}>
                            Answers:
                        </Typography>
                        {doubt.answers && doubt.answers.length > 0 ? (
                            doubt.answers.map((answer, index) => (
                                <Box key={index} sx={{ mt: 2, pl: 2 }}>
                                    <Typography variant="body1">
                                        <div className='flex items-center'>
                                            <img src={answer.answeredBy.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                                            <span className="mr-2">{answer.answeredBy.firstName} {answer.answeredBy.lastName}</span>
                                        </div>

                                    </Typography>
                                    <Typography variant="body2">
                                        {answer.content}
                                    </Typography>
                                    {index !== doubt.answers.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mt: 2 }}>
                                No answers yet
                            </Typography>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default MyQuestions;
