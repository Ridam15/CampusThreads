import React, { useState } from 'react';

export default function CommunityForm({ onCloseForm, onCancelForm }) {
  const [members, setMembers] = useState([
    'Member1',
    'Member2',
    'Member3',
  ]);
  const [selectedModerator, setSelectedModerator] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (picture) {
      const pictureUrl = await uploadToCloudinary(picture);
      formData.append('pictureUrl', pictureUrl);
      console.log(pictureUrl);
    }
    if (coverPicture) {
      const coverPictureUrl = await uploadToCloudinary(coverPicture);
      formData.append('coverPictureUrl', coverPictureUrl);
      console.log(coverPictureUrl);
    }

    formData.append('name', communityName);
    formData.append('description', description);

    // Send the form data to your API
    fetch('http://localhost:3000/api/v1/community/update', {
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
    setSelectedModerator(event.target.value);
  };

  const handleCancel = () => {
    setSelectedModerator('');
  };

  const handleCancelForm = () => {
    onCloseForm();
    setSelectedModerator('');
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
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
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
              value={selectedModerator}
              onChange={handleMemberSelect}
              className="w-full rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
            >
              <option value="" disabled>Select a Moderator</option>
              {members.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
            {selectedModerator && (
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
