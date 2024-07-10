import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

function AskQuestion() {
    const navigate = useNavigate();

    const navigateToCreatePost = () => {
        navigate('../CreatePost'); // Navigate to the create post page
    };

    return (
        <div className="ask-question-bar bg-gray-800 text-white p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Write a Question</h2>
            <button onClick={navigateToCreatePost} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Write
            </button>
        </div>
    );
}

export default AskQuestion;
