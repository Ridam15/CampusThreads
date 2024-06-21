// PostPage.jsx

import React, { useState } from 'react';
import CommentList from './CommentList';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './PostPage.css';

const PostPage = () => {
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Sample post data
    const samplePost = {
        title: 'Sample Post Title',
        content: '<p>This is the content of the post. It can contain <strong>HTML</strong> markup.</p>',
        tags: 'React, Example, Post',
    };

    const handleLike = () => {
        setLikeCount(likeCount + 1);
    };

    const handleComment = () => {
        setCommentCount(commentCount + 1);
        setComments([...comments, { id: commentCount + 1, text: newComment }]);
        setNewComment('');
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    return (
        <div className='post-page'>
            <header className='page-header'>
                <h1>Post</h1>
            </header>
            <main className='page-content'>
                <div className='post-container'>
                    <h1 className='post-title'>{samplePost.title}</h1>
                    <div className='post-content' dangerouslySetInnerHTML={{ __html: samplePost.content }} />
                    <div className='post-tags'>
                        <strong>Tags:</strong> {samplePost.tags}
                    </div>
                </div>
                <div className='interaction-section'>
                    <Button variant="outlined" onClick={handleLike}>Like ({likeCount})</Button>
                    <TextField
                        label="Add a comment"
                        variant="outlined"
                        fullWidth
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <Button variant="outlined" onClick={handleComment}>Comment</Button>
                </div>
                <CommentList comments={comments} />
            </main>
        </div>
    );
};

export default PostPage;
