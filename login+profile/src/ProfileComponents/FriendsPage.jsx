// FriendsPage.jsx
import React from 'react';

function FriendsPage({ onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">Friends List</h2>
                {/* Add your friends list here */}
                <ul>
                    <li>Friend 1</li>
                    <li>Friend 2</li>
                    <li>Friend 3</li>
                </ul>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default FriendsPage;
