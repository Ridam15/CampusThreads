// CommentList.jsx

import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const CommentList = ({ comments }) => {
    return (
        <div className='comment-list'>
            <h3>Comments</h3>
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment.id}>
                        <ListItemText primary={comment.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default CommentList;
