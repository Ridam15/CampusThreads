import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const apiUrl = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_PRESET = 'images_preset';
const CLOUDINARY_CLOUD_NAME = 'dkpznoy8d';
const cld = new Cloudinary({ cloud: { cloudName: CLOUDINARY_CLOUD_NAME } });


const Edit = ({ onBackToApp }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const quillRef = useRef();
  // const [details, setDetails] = useState({});
  const [Dob, setDob] = useState({});
  const [files, setFiles] = useState({ profilePhoto: null, coverPhoto: null });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [profilePhotoId, setProfilePhotoId] = useState('');
  const [coverPhotoId, setCoverPhotoId] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await fetch(
          `${apiUrl}/api/v1/profile/getUserDetails`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }
        );

        const data = await response.json();
        if (data.data) {
          setUserData(data.data);
          // setDetails(data.data.additionalDetails);
          // console.log(data);
          const date = data.data.additionalDetails.dateOfBirth;
          setDob(date);
        } else {
          console.warn('Received undefined data from the server');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount


  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dateOfBirth') {
      setDob(value); // Update the Dob state
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
    // console.log(userData);
  };
  const handleQuillChange = (value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      additionalDetails: {
        ...(prevUserData.additionalDetails || {}),
        about: value,
      },
    }));
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    if (name === 'dateOfBirth') {
      setDob(value); // Update the Dob state
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      additionalDetails: {
        ...(prevUserData.additionalDetails || {}), // merge with existing additionalDetails
        [name]: value,
      },
    }));
    // console.log(userData);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit');
    const confirmSave = window.confirm('Do you want to save changes?');
    // onBackToApp();
    const userDataToSubmit = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      collegeBranch: userData.additionalDetails.collegeBranch,
      collegeName: userData.additionalDetails.collegeName,
      dateOfBirth: userData.additionalDetails.dateOfBirth,
      about: userData.additionalDetails.about,
      gender: userData.additionalDetails.gender,
      profilePhotoUrl: profilePhotoUrl,
      coverPhotoUrl: coverPhotoUrl,
    };
    if (confirmSave) {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          console.error('Authentication token not found');
          return;
        }
        // console.log(token);
        console.log(userDataToSubmit);

        const response = await fetch(`${apiUrl}/api/v1/profile/updateProfile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(userDataToSubmit),
        });

        if (response.ok) {
          // Update successful
          // Fetch the updated user data
          const fetchDataResponse = await fetch(
            `${apiUrl}/api/v1/profile/getUserDetails`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            }
          );

          const updatedData = await fetchDataResponse.json();
          if (updatedData.data) {
            // Update the state with the new user data
            setProfilePhotoUrl(profilePhotoUrl);
            setCoverPhotoUrl(coverPhotoUrl);
            setUserData(updatedData.data);
            console.log(updatedData.data);
            onBackToApp();
          } else {
            console.warn('Received undefined data from the server');
          }
          const photoData = {
            profilePhotoUrl,
            coverPhotoUrl,
          };

        } else {
          // Handle error cases
          console.error('Error updating user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: files[0],
    }));
    console.log(files);
  };

  const handleFileUpload = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });
        // if()
        if (!cloudinaryResponse.ok) {
          throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.statusText}`);
        }

        const cloudinaryData = await cloudinaryResponse.json();
        console.log(cloudinaryData.secure_url);
        console.log(cloudinaryData.public_id);
        if (file == files.profilePhoto)
          setProfilePhotoId(cloudinaryData.public_id);
        else {
          setCoverPhotoId(cloudinaryData.public_id);
        }

        return cloudinaryData.secure_url;
      };

      const profilePhotoUrl = files.profilePhoto ? await uploadToCloudinary(files.profilePhoto) : null;
      const coverPhotoUrl = files.coverPhoto ? await uploadToCloudinary(files.coverPhoto) : null;
      console.log(profilePhotoUrl);
      setProfilePhotoUrl(profilePhotoUrl);
      setCoverPhotoUrl(coverPhotoUrl);
      // const photoData = {
      //   profilePhotoUrl,
      //   coverPhotoUrl,
      // };

    } catch (error) {
      console.error('Error updating profile pictures:', error);
    }
  };
  const getImage = (publicId) => {
    try {
      console.log(publicId);
      return cld.image(publicId)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(200).height(200));
    } catch (error) {
      console.error('Error generating image URL:', error);
      return null;
    }
  };
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 120);
    return minDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };



  const handleChangePassword = (e) => {
    e.preventDefault();
    // Handle password change, e.g., send data to a server
  };

  const padZero = (num) => {
    return (num < 10 ? '0' : '') + num;
  };
  const formatDOB = (dob) => {
    const date = new Date(dob);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  };




  return (



    <div className="bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {/* Change Profile Photo */}


      <form className="space-y-4">
        {/* Change Cover Photo */}
        <div className="flex justify-center w-full">
          <div className="col-xxl-4">
            <div className="bg-secondary-soft px-4 py-5 rounded">
              <div className="row g-3">
                <h4 className="mb-4 mt-0">Upload your profile photo</h4>
                {profilePhotoUrl && <AdvancedImage cldImg={getImage(profilePhotoId)} />}
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Upload
                </button>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="bg-secondary-soft px-4 py-5 rounded">
              <div className="row g-3">
                <h4 className="mb-4 mt-0">Upload your Cover photo</h4>
                {coverPhotoUrl && <AdvancedImage cldImg={getImage(coverPhotoId)} />}
                <input
                  type="file"
                  id="coverPhoto"
                  name="coverPhoto"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Upload
                </button>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Profile Information */}
        <div className="flex justify-center space-x-16 w-full">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              FirstName
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              LastName
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            About
          </label>
          <ReactQuill
            theme="snow"
            value={userData.additionalDetails?.about || ''}
            onChange={handleQuillChange}
            className="mt-1 block w-full h-full bg-gray resize-y rounded-md border"
          />


          {/* <ReactQuill
            // ref={quillRef}
            theme="snow"
            value={userData.additionalDetails ? userData.additionalDetails.about : ''}
            onChange={handleChange2}
            modules={{
              toolbar: [],
            }}
          // className="mt-1 block w-full h-full bg-gray resize-y rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          /> */}

        </div>
        <div className="w-4/5">
          <label htmlFor="college" className="block text-sm font-medium text-gray-700">
            College/University
          </label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            value={userData.additionalDetails ? userData.additionalDetails.collegeName : ''}
            onChange={handleChange2}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex justify-center w-full space-x-16">
          <div className="w-1/5">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Date Of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formatDOB(Dob)}
              onChange={handleChange2}
              min={getMinDate()} // Set the minimum date dynamically
              max={getMaxDate()} // Set the maximum date dynamically
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="w-2/5">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <Autocomplete
              id="gender"
              name="gender"
              options={['Male', 'Female', "Can't Say"]}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              value={userData.additionalDetails ? userData.additionalDetails.gender : ''}
              onChange={(event, value) =>
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  additionalDetails: {
                    ...(prevUserData.additionalDetails || {}),
                    gender: value,
                  },
                }))
              }
              getOptionLabel={(option) => option}
              PopperProps={{
                style: { width: 'fit-content' }, // Adjust width as needed
                placement: 'bottom-start', // Adjust placement if necessary
              }}
              className="mt-1 block w-full"
            />
          </div>
          <div className="w-3/5">
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
              Branch (for students)
            </label>
            <input
              type="text"
              id="collegeBranch"
              name="collegeBranch"
              value={userData.additionalDetails ? userData.additionalDetails.collegeBranch : ''}
              onChange={handleChange2}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        {/* Add more profile fields as needed */}

        {/* Change Password */}
        <div className="border-t pt-4 w-full">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <div className="w-3/5 ml-36">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="w-3/5 ml-36">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="w-3/5 ml-36">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex justify-start mt-4 space-x-4">
            <button
              type="button"
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 px-4 py-2 rounded-md"
              onClick={onBackToApp}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-500  hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
          <div className="w-3/5 ">
            <button
              onClick={handleChangePassword}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
