import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Box, Typography, Avatar, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const CommentModal = ({ post, open, handleClose }) => {
    const [comment, setComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false); // State to toggle comment editor
    const [apiResponse, setApiResponse] = useState(null); // State to store API response message

    const handleCommentChange = (content, delta, source, editor) => {
        setComment(content);
    };

    const handlePostComment = async () => {
        const token = localStorage.getItem("Token");
        try {
            const response = await fetch('http://localhost:3000/api/v1/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    postId: post.id, // Assuming post has an id property
                    content: comment,
                }),
            });
            const data = await response.json();
            setApiResponse(data.message); // Store API response message
            setComment(''); // Clear comment input
            setIsCommenting(false); // Close the comment editor after posting
        } catch (error) {
            console.error('Error posting comment:', error);
            setApiResponse('Error posting comment. Please try again.'); // Handle error state
        }
    };

    const toggleCommentEditor = () => {
        setIsCommenting(!isCommenting); // Toggle comment editor on/off
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl bg-white rounded-lg shadow-lg p-5 outline-none overflow-auto max-h-[90vh]">
                    <div className="post__wrapper mb-5 border-b-2 border-gray-200 pb-5">
                        <div className="post__header mb-3">
                            <Avatar src={post.profilePicture} className="post__avatar" />
                            <div className="post__info ml-3">
                                <h2 className="text-lg font-semibold">{post.name}</h2>
                                <div className='post__info__desc m-0'>
                                    <p className='post__info__desc m-0'>/{post.description}</p>
                                </div>
                            </div>
                            <div>
                                {post.accountType === 'Professor' ? <PersonOutlinedIcon fontSize="small" /> : null}
                            </div>
                            {post.tags
                                ? post.tags.map((tag, index) => (
                                    <span key={index} className="post__tag">
                                        {tag ? tag.name : null}
                                    </span>
                                ))
                                : null}
                        </div>

                        <div className='post__body mb-3'>
                            <ReactQuill
                                value={JSON.parse(post.message)}
                                readOnly={true}
                                theme="bubble"
                                className="custom-quill"
                            />
                        </div>
                    </div>

                    <div className="comment__section mt-5">
                        <Typography variant="body1" className="font-semibold">Comments</Typography>
                        <div className="mt-3">
                            {isCommenting ? (
                                <ReactQuill
                                    value={comment}
                                    onChange={handleCommentChange}
                                    theme="snow"
                                    className="w-full mt-2 mb-2 border border-gray-300 rounded-md"
                                    placeholder="Write your comment..."
                                />
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={toggleCommentEditor}
                                    className="mt-2"
                                >
                                    Write your comment...
                                </Button>
                            )}
                            {isCommenting && (
                                <Button variant="contained" color="primary" onClick={handlePostComment} className="mt-2 ml-2">
                                    Comment
                                </Button>
                            )}
                        </div>

                        {apiResponse && (
                            <Typography variant="body1" className="mt-2">
                                {apiResponse}
                            </Typography>
                        )}

                        <div className="mt-5">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, index) => (
                                    <div key={index} className="flex items-start mb-4 border-l-4 border-blue-500 pl-3">
                                        <Avatar src={comment.commentedBy.profilePicture} className="mr-2" />
                                        <div>
                                            <Typography variant="body2" className="font-semibold">{comment.commentedBy.firstName} {comment.commentedBy.lastName}</Typography>
                                            <ReactQuill
                                                value={comment.content} // Display comment content using ReactQuill
                                                readOnly={true}
                                                theme="bubble"
                                                className="custom-quill"
                                                modules={{ toolbar: false }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body1" className="text-gray-500">No comments to show</Typography>
                            )}
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default CommentModal;
