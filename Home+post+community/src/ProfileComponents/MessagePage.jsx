import React, { useState, useEffect } from 'react';
import SendBird from 'sendbird';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import './MessagePage.css'; // Ensure this CSS file exists and is correctly styled

function MessagePage({ onClose }) {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [sendbirdInstance, setSendbirdInstance] = useState(null);
    const [channel, setChannel] = useState(null);

    // Fetch the list of friends
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

    // Initialize SendBird instance
    useEffect(() => {
        const sb = new SendBird({ appId: '8046684E-257A-439C-BF36-C9B565AD31E4' }); // Replace with your actual SendBird App ID
        setSendbirdInstance(sb);
    }, []);

    // Function to create a user if not exists using SendBird Platform API
    const createUserIfNotExists = async (userId, nickname, friendProfileUrl) => {
        const API_TOKEN = '0a9f4081312a6e0c8aee6a7b15b1d0965b89da07'; // Replace with your SendBird API token
        const url = `https://api-8046684E-257A-439C-BF36-C9B565AD31E4.sendbird.com/v3/users`;

        const body = {
            user_id: userId,
            nickname: nickname,
            profile_url: friendProfileUrl,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf8',
                    'Api-Token': API_TOKEN,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok && response.status !== 409) { // 409 means user already exists
                console.log(response.json());
                throw new Error('Failed to create user');
                // console.log(response.json());
            }

            return true;
        } catch (error) {
            console.error('SendBird createUser error:', error);
            throw error;
        }
    };

    // Function to start a chat with a friend
    const startChat = async (friend) => {
        if (sendbirdInstance) {
            try {
                const userId = localStorage.getItem('UserId'); // Ensure USER_ID is correctly set
                if (!userId) {
                    console.error('USER_ID is not set in localStorage');
                    return;
                }
                const friendProfileUrl = friend.profileUrl || 'https://example.com/default-profile.png';
                // await createUserIfNotExists(friend.id, `${friend.firstName} ${friend.lastName}`, friendProfileUrl);

                sendbirdInstance.connect(userId, async (user, error) => {
                    if (error) {
                        console.error('SendBird connection error:', error);
                        return;
                    }

                    console.log('Connected as', user);

                    const params = new sendbirdInstance.GroupChannelParams();
                    params.addUserIds([friend.id]);
                    params.isDistinct = true;

                    sendbirdInstance.GroupChannel.createChannel(params, (groupChannel, error) => {
                        if (error) {
                            console.error('SendBird createChannel error:', error);
                            return;
                        }
                        console.log('Channel created:', groupChannel);
                        setChannel(groupChannel);
                        setSelectedFriend(friend);
                        setMessages([]);
                        loadMessages(groupChannel);
                    });
                });
            } catch (error) {
                console.error('Error starting chat:', error);
            }
        }
    };

    // Function to load messages for a channel
    const loadMessages = (channel) => {
        const messageListQuery = channel.createPreviousMessageListQuery();
        messageListQuery.load(20, true, (messageList, error) => {
            if (error) {
                console.error('SendBird loadMessages error:', error);
                return;
            }
            setMessages(messageList);
        });
    };
    useEffect(() => {
        if (channel) {
            const interval = setInterval(() => {
                loadMessages(channel);
            }, 1000); // Fetch messages every 10 seconds

            // Clear interval on component unmount or channel change
            return () => clearInterval(interval);
        }
    }, [channel]);
    // Function to handle sending a message
    const sendMessage = () => {
        if (channel && messageText.trim()) {
            const params = new sendbirdInstance.UserMessageParams();
            params.message = messageText;
            channel.sendUserMessage(params, (message, error) => {
                if (error) {
                    console.error('SendBird sendMessage error:', error);
                    return;
                }
                setMessages((prevMessages) => [message, ...prevMessages]);
                setMessageText('');
            });
        }
    };
    const deleteMessage = (messageId) => {
        if (channel) {
            const messageToDelete = messages.find((message) => message.messageId === messageId);
            if (messageToDelete && messageToDelete._sender.userId === sendbirdInstance.currentUser.userId) {
                channel.deleteMessage(messageToDelete, (response, error) => {
                    if (error) {
                        console.error('SendBird deleteMessage error:', error);
                        return;
                    }
                    setMessages((prevMessages) => prevMessages.filter((message) => message.messageId !== messageId));
                });
            } else {
                console.error('User does not have permission to delete this message');
            }
        }
    };
    // Fetch friends on component mount
    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center" onClick={onClose}>
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">Messages</h2>
                <div className="flex message-container">
                    <div className="w-1/3 border-r pr-4">
                        <h3 className="text-xl mb-4">Friends</h3>
                        <ul>
                            {friends.map((friend) => (
                                <li key={friend.id} className="mb-2 cursor-pointer" onClick={() => startChat(friend)}>
                                    {friend.firstName} {friend.lastName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 pl-4 chat-section">
                        {selectedFriend ? (
                            <div>
                                <h3 className="text-xl mb-4">Chat with {selectedFriend.firstName} {selectedFriend.lastName}</h3>
                                <div className="mb-4">
                                    {messages.slice().reverse().map((message) => (
                                        (message?._sender?.nickname === selectedFriend.firstName) ?
                                            (<div key={message.messageId} className="mb-4 bg-slate-100 rounded-l p-2 w-4/5">
                                                <strong>{message?._sender?.nickname}:</strong> {message.message}
                                            </div>) :
                                            (<div key={message.messageId} className="mb-4 text-right">
                                                {message.message}
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => deleteMessage(message.messageId)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>

                                            </div>)

                                    ))}
                                </div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="border rounded p-2 flex-grow"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <button className="bg-blue-500 text-white p-2 rounded ml-2" onClick={sendMessage}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Select a friend to start chatting</div>
                        )}
                    </div>
                </div>
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

export default MessagePage;
