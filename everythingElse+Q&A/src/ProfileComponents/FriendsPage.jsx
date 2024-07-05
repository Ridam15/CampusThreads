import React, { useState, useEffect, useRef } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './FriendsPage.css'; // Import the custom CSS for animation

function FriendsPage({ onClose }) {
    const friendsListRef = useRef(null);

    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]); // Add state for sent requests
    const [receivedRequests, setReceivedRequests] = useState([]); // Add state for received requests

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

    const fetchSentRequests = async () => {
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/getallreqsent', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            const data = await response.json();
            console.log(data.data);
            setSentRequests(data.data);
        } catch (error) {
            console.error('Error fetching sent requests:', error);
            alert('Error fetching sent requests. Please try again later.');
        }
    };

    const fetchReceivedRequests = async () => {
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/getallreqrec', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            const data = await response.json();
            console.log(data.data);
            setReceivedRequests(data.data);
        } catch (error) {
            console.error('Error fetching received requests:', error);
            alert('Error fetching received requests. Please try again later.');
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchSentRequests();
        fetchReceivedRequests();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [animationClass, setAnimationClass] = useState('');

    const [activeTab, setActiveTab] = useState('friends');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleDropdown = (friendId) => {
        if (activeDropdown === friendId) {
            setAnimationClass('fade-out');
            setTimeout(() => {
                setActiveDropdown(null);
            }, 300);
        } else {
            setActiveDropdown(friendId);
            setAnimationClass('fade-in');
        }
    };

    const handleMessageClick = (friendId) => {
        console.log(`Message to friend ${friendId}`);
    };

    const handleUnfriendClick = async (friendId) => {
        const token = localStorage.getItem('Token');
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/unFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ id: friendId }),
            });
            if (response.ok) {
                setFriends(friends.filter(friend => friend.id !== friendId));
                alert('Friend removed successfully.');
            } else {
                alert('Error unfriending. Please try again later.');
            }
        } catch (error) {
            console.error('Error unfriending:', error);
            alert('Error unfriending. Please try again later.');
        }
    };

    const revertToDropdownButton = (friendId) => {
        setAnimationClass('fade-out');
        setTimeout(() => {
            setActiveDropdown(null);
        }, 300);
    };

    const filteredFriends = friends.filter(friend =>
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleDeleteRequestClick = async (requestId) => {
        const token = localStorage.getItem('Token');
        const id = requestId;
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/delreq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                setSentRequests(sentRequests.filter(request => request.id !== requestId));
            } else {
                alert('Error deleting request. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Error deleting request. Please try again later.');
        }
    };

    const handleAcceptRequestClick = async (requestId) => {
        const token = localStorage.getItem('Token');
        const id = requestId;
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/acceptreq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                console.log(response);
                setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
                fetchFriends();
            } else {
                alert('Error accepting request. Please try again later.');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Error accepting request. Please try again later.');
        }
    };

    const handleDeclineRequestClick = async (requestId) => {
        const token = localStorage.getItem('Token');
        const id = requestId;
        try {
            const response = await fetch('http://localhost:3000/api/v1/friends/declinereq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
            } else {
                alert('Error declining request. Please try again later.');
            }
        } catch (error) {
            console.error('Error declining request:', error);
            alert('Error declining request. Please try again later.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg overflow-auto"
                onClick={(e) => e.stopPropagation()}
                ref={friendsListRef}
            >
                <h2 className="text-2xl font-bold mb-4">Friends Page</h2>

                <div className="flex mb-4">
                    <button
                        className={`px-4 py-2 ${activeTab === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        Request Sent
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'received' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('received')}
                    >
                        Request Received
                    </button>
                </div>

                {activeTab === 'friends' && (
                    <input
                        type="text"
                        placeholder="Search friends..."
                        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                )}

                {activeTab === 'friends' && (
                    <ul>
                        {filteredFriends.map(friend => (
                            <li key={friend.id} className="flex justify-between items-center mb-1 border border-gray-200 p-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={friend.profilePicture}
                                        alt={`${friend.firstName}'s profile`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span>{friend.firstName}</span>
                                </div>
                                <div className="relative">
                                    {activeDropdown === friend.id ? (
                                        <div className={`flex items-center space-x-2 ${animationClass}`}>
                                            <button
                                                className="px-2 py-2 bg-blue-500 text-white rounded-lg scale-up"
                                                onClick={() => handleMessageClick(friend.id)}
                                            >
                                                Message
                                            </button>
                                            <button
                                                className="px-2 py-2 bg-red-500 text-white rounded-lg scale-up"
                                                onClick={() => handleUnfriendClick(friend.id)}
                                            >
                                                Unfriend
                                            </button>
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
                )}

                {activeTab === 'sent' && (
                    <ul>
                        {sentRequests.map(request => (
                            <li key={request.id} className="flex justify-between items-center mb-2 border border-gray-200 p-2 rounded-lg">
                                <span>{request.firstName}</span>
                                <button
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg scale-up"
                                    onClick={() => handleDeleteRequestClick(request.id)}
                                >
                                    Delete Request
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {activeTab === 'received' && (
                    <ul>
                        {receivedRequests.map(request => (
                            <li key={request.id} className="flex justify-between items-center mb-2 border border-gray-200 p-2 rounded-lg">
                                <span>{request.firstName}</span>
                                <div className="flex space-x-2">
                                    <button
                                        className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center scale-up"
                                        onClick={() => handleAcceptRequestClick(request.id)}
                                    >
                                        <CheckIcon />
                                    </button>
                                    <button
                                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center scale-up"
                                        onClick={() => handleDeclineRequestClick(request.id)}
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

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
