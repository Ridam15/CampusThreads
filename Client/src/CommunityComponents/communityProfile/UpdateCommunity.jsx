import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommunityForm({ onCloseForm, onCancelForm }) {
  const { name } = useParams();
  const [selectedMember, setSelectedMember] = useState('');
  const [communityDetails, setCommunityDetails] = useState({
    name: '',
    description: '',
    pictureUrl: '',
    coverPictureUrl: '',
    members: [], // Updated to store members array
  });
  const [picture, setPicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("Token");

    const fetchCommunityDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/community/getDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({ 'name': name })
        });

        const data = await response.json();
        if (response.ok) {
          const { name, description, pictureUrl, coverPictureUrl, members } = data.data;
          setCommunityDetails({
            name,
            description,
            pictureUrl,
            coverPictureUrl,
            members, // Store members array from API
          });
          if (members.length > 0) {
            setSelectedMember(members[0]._id); // Assuming the first member is selected initially
          }
          // You might need to handle pictureUrl and coverPictureUrl to set them if needed
        } else {
          console.error('Failed to fetch community details:', data.message);
          // Handle error scenario
        }
      } catch (error) {
        console.error('Error fetching community details:', error);
      }
    };

    if (name) {
      fetchCommunityDetails();
    }
  }, [name]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (picture) {
      const pictureUrl = await uploadToCloudinary(picture);
      formData.append('pictureUrl', pictureUrl);
    }
    if (coverPicture) {
      const coverPictureUrl = await uploadToCloudinary(coverPicture);
      formData.append('coverPictureUrl', coverPictureUrl);
    }

    formData.append('name', communityDetails.name);
    formData.append('description', communityDetails.description);
    formData.append('moderators', selectedMember); // Append selected member ID as moderator in form data

    fetch(`${apiUrl}/api/v1/community/update`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        // Handle success
        onCloseForm();
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  };

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

  const handleMemberSelect = (event) => {
    setSelectedMember(event.target.value);
  };

  const handleCancel = () => {
    setSelectedMember('');
  };

  const handleCancelForm = () => {
    onCloseForm();
    setSelectedMember('');
    onCancelForm();
  };

  return (
    <main className="max-w-4xl mx-auto w-screen flex flex-col items-center justify-center overflow-auto">
      <header className="my-6">
        <p className="text-center font-extrabold font-serif text-black tracking-wider text-6xl">Update Community</p>
      </header>
      <form onSubmit={handleSubmit} className="w-full grid gap-2 px-4">
        <div className="flex justify-between items-center">
          <label htmlFor="communityName" className="w-44 font-serif text-right pr-4 font-bold text-gray-700">
            Change Community Name
          </label>
          <div className="flex-1">
            <input
              placeholder="Community Name"
              type="text"
              id="communityName"
              value={communityDetails.name}
              onChange={(e) => setCommunityDetails({ ...communityDetails, name: e.target.value })}
              className="w-full rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label htmlFor="moderator" className="w-44 font-serif text-right pr-4 font-bold text-gray-700">
            Add Moderator
          </label>
          <div className="flex-1 flex items-center">
            <select
              id="moderator"
              value={selectedMember}
              onChange={handleMemberSelect}
              className="w-full rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
            >
              <option value="" disabled>Select a Member</option>
              {communityDetails.members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
            {selectedMember && (
              <button
                type="button"
                onClick={handleCancel}
                className="ml-2 p-1 text-red-500 hover:text-red-700 focus:outline-none"
              >
                X
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label htmlFor="description" className="w-44 font-serif text-right pr-4 font-bold text-gray-700">Add/Change Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            rows="3"
            value={communityDetails.description}
            onChange={(e) => setCommunityDetails({ ...communityDetails, description: e.target.value })}
            className="w-full flex-1 placeholder:text-slate-400 appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
          ></textarea>
        </div>

        <div className="flex items-center">
          <label htmlFor="communityLogo" className="w-44 font-serif text-right pr-4 font-bold text-gray-700">Change Community Logo</label>
          <input
            type="file"
            onChange={(e) => setPicture(e.target.files[0])}
            className="block text-sm text-gray-400 file:mr-2 file:py-2 file:px-2 file:rounded-md file:border-solid file:border file:border-gray-200 file:text-sm file:bg-white file:text-gray-500 hover:file:bg-gray-100"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="backgroundImage" className="w-44 font-serif text-right pr-4 font-bold text-gray-700">Change Background Image</label>
          <input
            type="file"
            onChange={(e) => setCoverPicture(e.target.files[0])}
            className="block text-sm text-gray-400 file:mr-2 file:py-2 file:px-2 file:rounded-md file:border-solid file:border file:border-gray-200 file:text-sm file:bg-white file:text-gray-500 hover:file:bg-gray-100"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm font-bold rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Update
          </button>
          <button
            onClick={handleCancelForm}
            type="button"
            className="bg-white py-2 px-2 border border-gray-300 rounded-md shadow-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
