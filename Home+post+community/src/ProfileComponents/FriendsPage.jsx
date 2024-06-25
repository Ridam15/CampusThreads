import React, { useState, useEffect, useRef } from 'react';
import './FriendsPage.css'; // Import the custom CSS for animation

function FriendsPage({ onClose }) {
    const friendsListRef = useRef(null);

    // Example list of friends (can be passed as props or fetched from API)
    const [friends, setFriends] = useState([]);
    const fetchFriends = async () => {
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/getallFriends', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            const data = await response.json();
            setFriends(data.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
            alert('Error fetching user details. Please try again later.');
        }
    };
    useEffect(() => {
        fetchFriends();
    }, []);
    // State for search input
    const [searchTerm, setSearchTerm] = useState('');

    // State to manage dropdown visibility and type
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [animationClass, setAnimationClass] = useState('');

    // Function to handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to toggle dropdown menu
    const toggleDropdown = (friendId) => {
        if (activeDropdown === friendId) {
            setAnimationClass('fade-out');
            setTimeout(() => {
                setActiveDropdown(null);
            }, 300); // Match the duration of fade-out animation
        } else {
            setActiveDropdown(friendId);
            setAnimationClass('fade-in');
        }
    };

    // Function to handle message button click
    const handleMessageClick = (friendId) => {
        console.log(`Message to friend ${friendId}`);
    };

    // Function to handle unfriend button click
    const handleUnfriendClick = (friendId) => {
        console.log(`Unfriend friend ${friendId}`);
    };

    // Function to revert to single dropdown button
    const revertToDropdownButton = (friendId) => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            setActiveDropdown(null);
        }, 300); // Match the duration of fade-out animation
    };

    // Filtered friends based on search term
    const filteredFriends = friends.filter(friend =>
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Effect to close the FriendsPage on scroll outside the friends list
    useEffect(() => {
        const handleScroll = (event) => {
            if (friendsListRef.current && !friendsListRef.current.contains(event.target)) {
                onClose();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg overflow-auto"
                onClick={(e) => e.stopPropagation()}
                ref={friendsListRef}
            >
                <h2 className="text-2xl font-bold mb-4">Friends List</h2>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search friends..."
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={handleSearch}
                />

                {/* List of friends */}
                <ul>
                    {filteredFriends.map(friend => (
                        <li key={friend.id} className="flex justify-between items-center mb-2">
                            <span>{friend.firstName}</span>
                            <div className="relative">
                                {activeDropdown === friend.id ? (
                                    <div className={`flex items-center space-x-2 ${animationClass}`}>
                                        <button
                                            className="px-3 py-2 bg-blue-500 text-white rounded-lg scale-up"
                                            onClick={() => handleMessageClick(friend.id)}
                                        >
                                            Message
                                        </button>
                                        <button
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg scale-up"
                                            onClick={() => handleUnfriendClick(friend.id)}
                                        >
                                            Unfriend
                                        </button>
                                        {/* Small button to revert back to single dropdown */}
                                        <button
                                            className="text-gray-600 hover:text-gray-900 focus:outline-none text-sm px-1 rounded scale-up"
                                            onClick={() => revertToDropdownButton(friend.id)}
                                        >
                                            &#8722;
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="text-gray-600 hover:text-gray-900 focus:outline-none scale-up"
                                        onClick={() => toggleDropdown(friend.id)}
                                    >
                                        &#8226;&#8226;&#8226;
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Close button */}
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg scale-up"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default FriendsPage;
