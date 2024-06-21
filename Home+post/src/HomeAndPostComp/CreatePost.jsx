import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { TextField, Autocomplete, Switch, FormControlLabel } from '@mui/material';

const CreatePost = () => {
    const navigate = useNavigate();
    const [content2, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isDoubt, setIsDoubt] = useState(false);
    const [communityList, setCommunityList] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const quillRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem("Token");
        const fetchCommunityList = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/profile/getUserMemberCommunity', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                });

                const data = await response.json();
                setCommunityList(data.data.community);
            } catch (error) {
                console.error('Error fetching community list:', error);
            }
        };

        fetchCommunityList();
    }, []);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'images_preset');

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/dkpznoy8d/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!cloudinaryResponse.ok) {
            throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.statusText}`);
        }

        const cloudinaryData = await cloudinaryResponse.json();
        return cloudinaryData.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("Token");

        const quill = quillRef.current.getEditor();
        const delta = quill.getContents();
        const imageBlots = delta.ops.filter(op => op.insert && op.insert.image);

        // Upload images and update their URLs in content
        const uploadPromises = imageBlots.map(async (blot) => {
            const imageFile = blot.insert.image;
            const imageUrl = await uploadToCloudinary(imageFile);
            return { original: imageFile, uploaded: imageUrl };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Update content with new image URLs
        let newContent = delta.ops.map(op => {
            if (op.insert && op.insert.image) {
                const uploadedImage = uploadedImages.find(img => img.original === op.insert.image);
                if (uploadedImage) {
                    return { insert: { image: uploadedImage.uploaded } };
                }
            }
            return op;
        });

        const updatedContent = JSON.stringify(newContent);

        try {
            const baseEndpoint = 'http://localhost:3000/api/v1/';
            const endpoint = isDoubt ? 'doubt/create' : 'post/create';

            const tagArray = tags.split(',').map(tag => tag.trim().replace(/[^a-zA-Z0-9 ]/g, ''));
            const tagsString = tagArray.join(',');

            const formData = {
                content: updatedContent,
                communityName: selectedCommunity,
                tags: tagsString,
                pictureUrl: null,
            };

            const response = await fetch(`${baseEndpoint}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to ${isDoubt ? 'create doubt' : 'create post'}`);
            } else if (response.success) {
                alert(`${responseData.message}`);
            }

            alert(`${isDoubt ? 'Doubt' : 'Post'} created successfully:`);

            setContent('');
            setTags('');
            setSelectedCommunity(null);
        } catch (error) {
            console.error(`Error creating ${isDoubt ? 'doubt' : 'post'}:`, error);
        }
    };

    const handleCancel = () => {
        navigate('../Home');
    };

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100 p-4 overflow-y-auto'>
            <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg'>
                <h2 className="text-2xl font-bold mb-6">Create a New Post</h2>
                <form onSubmit={handleSubmit} className="flex items-stretch space-y-6">
                    <div className='space-y-2'>
                        <label htmlFor="content" className="block text-gray-700 font-bold">Content</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content2}
                            onChange={(value) => setContent(value)}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link', 'image'],
                                    ['clean'],
                                ],
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike',
                                'list', 'bullet',
                                'link', 'image',
                            ]}
                            placeholder="Write your post..."
                            className="bg-gray-100 p-4 rounded min-h-[16rem] h-auto"
                        />
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="tags" className="block text-gray-700 font-bold">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder='Enter your tags'
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className='w-1/2 space-y-2'>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={communityList.map((list) => (list.name))}
                            value={selectedCommunity}
                            onChange={(event, newValue) => setSelectedCommunity(newValue)}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Community" />}
                        />
                    </div>

                    <div className="space-x-2">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isDoubt}
                                    onChange={() => setIsDoubt(!isDoubt)}
                                    color="primary"
                                />
                            }
                            label="Question"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-700">Post</button>
                        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded transition duration-300 hover:bg-gray-400" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
