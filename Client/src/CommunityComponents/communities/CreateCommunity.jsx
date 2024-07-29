import { useState } from 'react';

export default function CreateCommunity({ onClose, onCancel }) {
  const [communityData, setCommunityData] = useState({
    name: '',
    description: ''
    ,
  });
  const [tag2, setTag] = useState([]);
  const [communityLogo, setCommunityLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogoChange = (e) => {
    setCommunityLogo(e.target.files[0]);
  };

  const handleBackgroundImageChange = (e) => {
    setBackgroundImage(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommunityData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('Token');
      // const formData = new FormData();
      const communityLogo2 = await uploadToCloudinary(communityLogo);
      const backgroundImage2 = await uploadToCloudinary(backgroundImage);
      // formData.append('name', communityData.name);
      // formData.append('description', communityData.description);
      // formData.append('tags', tag2);
      // formData.append('pictureUrl', communityLogo2);
      // formData.append('coverPictureUrl', backgroundImage2);
      const formData = {
        name: communityData.name,
        description: communityData.description,
        tags: tag2,
        pictureUrl: communityLogo2,
        coverPictureUrl: backgroundImage2
      };

      // Create Community (POST)
      const response = await fetch(`${apiUrl}/api/v1/community/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error(`Failed to create community: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);

      onClose();
    }
    catch (error) {
      console.log(error);
      console.error('Error updating community:', error.message);
    }
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
  return (
    // ... existing code ...
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-full sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit} className="p-8 w-full">
            <main className="max-w-4xl mx-auto flex flex-col items-center justify-center">
              <header className="my-6">
                <p className="text-center font-extrabold font-serif text-black tracking-wider text-6xl">
                  Create Community
                </p>
              </header>

              {/* Your form content */}
              <div className="grid gap-2 px-4 w-full">
                {/* Community Name */}
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="communityName"
                    className="w-44 text-right pr-4 font-bold text-gray-700"
                  >
                    Community Name
                  </label>
                  <div className="flex-1">
                    <input
                      required
                      placeholder="Community Name"
                      type="text"
                      id="communityName"
                      name="name"
                      value={communityData.name}
                      onChange={handleInputChange}
                      className="w-full flex-1 max-w-full rounded-md appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="description"
                    className="w-44 text-right pr-4 font-bold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={communityData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows="3"
                    className="w-full flex-1 placeholder:text-slate-400 appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  ></textarea>
                </div>

                {/* tags */}
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="tags"
                    className="w-44 text-right pr-4 font-bold text-gray-700"
                  >
                    Tag
                  </label>
                  <textarea
                    id="tags"
                    name="tags"
                    value={tag2}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="tag"
                    // rows="3"
                    className="w-full flex-1 placeholder:text-slate-400 appearance-none border border-gray-300 py-2 px-2 bg-white text-gray-700 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
                  ></textarea>

                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="communityLogo"
                    className="w-44 font-serif text-right pr-4 font-bold text-gray-700"
                  >
                    Community Logo
                  </label>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    className="block text-sm text-gray-400 file:mr-2 file:py-2 file:px-2 file:rounded-md file:border-solid file:border file:border-gray-200 file:text-sm file:bg-white file:text-gray-500 hover:file:bg-gray-100"
                  />
                </div>

                {/* Background Image */}
                <div className="flex items-center">
                  <label
                    htmlFor="backgroundImage"
                    className="w-44 font-serif text-right pr-4 font-bold text-gray-700"
                  >
                    Background Image
                  </label>
                  <input
                    type="file"
                    onChange={handleBackgroundImageChange}
                    className="block text-sm text-gray-400 file:mr-2 file:py-2 file:px-2 file:rounded-md file:border-solid file:border file:border-gray-200 file:text-sm file:bg-white file:text-gray-500 hover:file:bg-gray-100"
                  />
                </div>


                {/* Form Buttons */}
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    className="bg-white py-2 px-2 border border-gray-300 rounded-md shadow-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
                    onClick={() => {
                      onCancel(); // Call the onCancel callback
                      onClose(); // Close the form
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm font-bold rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Create Community
                  </button>
                </div>
              </div>
            </main>

          </form>

        </div>
      </div>
    </div>
  );
}