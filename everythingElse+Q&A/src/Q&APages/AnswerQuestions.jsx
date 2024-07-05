import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Modal, Box } from '@mui/material';
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
    const [answers, setAnswers] = useState({});
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

    const handleAnswerSubmit = () => {
        if (selectedQuestion !== null) {
            setAnswers({
                ...answers,
                [selectedQuestion]: answerText
            });
            handleClose();
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
                        <div key={doubt._id} className="mb-4">
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
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleOpen(doubt._id)}
                                className="mt-2"
                            >
                                Write your answer
                            </Button>
                        </div>
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
