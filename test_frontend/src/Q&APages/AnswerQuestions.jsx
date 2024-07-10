import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Modal, Box, Divider } from '@mui/material';
import Post from '../HomeAndPostComp/Post';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

function AnswerQuestions() {
    const [doubts, setDoubts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answerText, setAnswerText] = useState("");

    useEffect(() => {
        const fetchDoubts = async () => {
            const token = localStorage.getItem("Token");
            try {
                const response = await fetch("http://localhost:3000/api/v1/doubt/getallDoubts", {
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

    const handleOpen = (questionId) => {
        setSelectedQuestion(questionId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAnswerText("");
    };

    const handleAnswerSubmit = async () => {
        if (selectedQuestion !== null) {
            const token = localStorage.getItem("Token");
            try {
                const response = await fetch("http://localhost:3000/api/v1/answer/create", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        doubtId: selectedQuestion,
                        content: answerText
                    })
                });

                if (response.ok) {
                    // Update doubts state to reflect the new answer
                    const updatedDoubts = doubts.map(doubt => {
                        if (doubt._id === selectedQuestion) {
                            return {
                                ...doubt,
                                answers: [
                                    ...doubt.answers,
                                    {
                                        content: answerText, answeredBy: { // Assuming answeredBy contains user information
                                            profilePicture: localStorage.getItem("profilePicture"),
                                            firstName: localStorage.getItem("firstName"),
                                            lastName: localStorage.getItem("lastName"),
                                            community: localStorage.getItem("community")
                                        }
                                    }
                                ]
                            };
                        }
                        return doubt;
                    });

                    setDoubts(updatedDoubts);
                    setAnswerText("");
                    handleClose();
                } else {
                    console.error("Failed to submit answer");
                }
            } catch (error) {
                console.error("Error during answer submit:", error);
            }
        }
    };

    const userId = localStorage.getItem("UserId");

    return (
        <div className="answer-questions">
            <div className="container mx-auto p-4">
                <div className="mb-4">
                    <Typography variant="h4">Answer Questions</Typography>
                </div>
                <div className="w-full flex flex-col gap-4">
                    {doubts.slice().reverse().filter(doubt => doubt.createdBy._id !== userId).map((doubt) => (
                        <Box key={doubt._id} className="mb-4" sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2 }}>
                            <Post
                                name={`${doubt.createdBy.firstName} ${doubt.createdBy.lastName}`}
                                description={doubt.community ? doubt.community.name : "Deleted Community"}
                                tags={doubt.tags}
                                doubts={true}
                                message={doubt.content}
                                photoUrl={doubt.fileUrl}
                                numLikes={doubt.likes.length}
                                liked__alr={doubt.likes.some(like => like._id === userId)}
                                color={doubt.likes.some(like => like._id === userId) ? '#3480cd' : 'gray'}
                                id={doubt._id}
                                profilePicture={doubt.createdBy.profilePicture}
                            />
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
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                    No answers yet
                                </Typography>
                            )}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleOpen(doubt._id)}
                                sx={{ mt: 2 }}
                            >
                                Write your answer
                            </Button>
                        </Box>
                    ))}
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Write Your Answer
                        </Typography>
                        <TextField
                            id="modal-description"
                            variant="outlined"
                            label="Your Answer"
                            multiline
                            fullWidth
                            rows={4}
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="mb-2"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAnswerSubmit}
                        >
                            Submit Answer
                        </Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default AnswerQuestions;
