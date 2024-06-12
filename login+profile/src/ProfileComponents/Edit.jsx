import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Edit = ({ onBackToApp }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({

  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await fetch(
          '',
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
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
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

    if (confirmSave) {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          console.error('Authentication token not found');
          return;
        }
        console.log(token);

        const response = await fetch('', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(userData, about,),
        });

        if (response.ok) {
          // Update successful
          // Fetch the updated user data
          const fetchDataResponse = await fetch(
            '',
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
            setUserData(updatedData.data);
            console.log(updatedData);
            onBackToApp();
          } else {
            console.warn('Received undefined data from the server');
          }
        } else {
          // Handle error cases
          console.error('Error updating user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
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

  const formatDOB = (dob) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dob).toLocaleDateString(undefined, options);
  };


  return (



    <div className="bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {/* Change Profile Photo */}
      <div>
        <div className="col-xxl-4">
          <div className="bg-secondary-soft px-4 py-5 rounded">
            <div className="row g-3">
              <h4 className="mb-4 mt-0">Upload your profile photo</h4>
              <div className="text-center"></div>

              <div className="square position-relative display-2 mb-3">
                <img className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></img>
              </div>
              <input type="file" id="customFile" name="file" hidden=""></input>
              <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" htmlFor="customFile">Upload</button>
              <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Remove</button>

            </div></div></div></div>

      <form className="space-y-4">
        {/* Change Cover Photo */}
        <div>
          <div className="col-xxl-4">
            <div className="bg-secondary-soft px-4 py-5 rounded">
              <div className="row g-3">
                <h4 className="mb-4 mt-0">Upload your Cover photo</h4>
                <div className="text-center"></div>

                <div className="square position-relative display-2 mb-3">
                  <img className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></img>
                </div>
                <input type="file" id="customFile" name="file" hidden=""></input>
                <label className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" htmlFor="customFile">Upload</label>
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Remove</button>

              </div></div></div></div>


        {/* Profile Information */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            About
          </label>
          <input
            type="text"
            id="about"
            name="about"
            value={userData.additionalDetails ? userData.additionalDetails.about : ''}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Date Of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            min={getMinDate()} // Set the minimum date dynamically
            max={getMaxDate()} // Set the maximum date dynamically
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          />
        </div>


        <div>
          <label htmlFor="college" className="block text-sm font-medium text-gray-700">
            College/University
          </label>
          <input
            type="text"
            id="college"
            name="college"
            value=''
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
            Branch (for students)
          </label>
          <input
            type="text"
            id="branch"
            name="branch"
            value=''
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
          />
        </div>
        {/* Add more profile fields as needed */}

        {/* Change Password */}
        <div className="border-t pt-4">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <div>
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
          <div>
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
          <div>
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
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
          <div>
            <button
              onClick={handleChangePassword}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
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
