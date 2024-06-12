// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Profilecomp({ onEditClick }) {

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchData = async () => {
      try {
        const response = await fetch('', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();
        console.log(data.data);
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching user details. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const formatDOB = (dob) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dob).toLocaleDateString(undefined, options);
  };

  return (
    <div className="">
      <div>
        <img
          src='https://images.pexels.com/photos/13095812/pexels-photo-13095812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          className="mt-4 mb-4 rounded-xl w-full px-48 h-40 object-cover "
          alt="ProfileCoverPage"
        />
      </div>
      <div className="flex mr-0">
        <div className="ml-48 mt-4 pl-8">
          <img src={userData.profilePicture}
            className="w-32 h-32 bg-blue-100 rounded-full border-2 border-2xl border-black"
            alt="ProfilePicture"
          />
        </div>



        <div className="flex flex-col w-2/5 h-32 justify-between ml-10 ">
          {/* Profile details go here */}
          <div className=" flex justify-between ">
            <p className="ml-12 pt-4 font-semibold text-2xl">{userData.firstName} {userData.lastName}</p>

          </div>
          <div className="ml-12 mt-2 text-xl">Date of Birth : {userData.additionalDetails ? formatDOB(userData.additionalDetails.dateOfBirth) : ''}</div>



          <div className="flex justify-start items-center space-x-16 ">
            <button
              onClick={onEditClick}
              className="ml-10 w-28 h-12 mt-4 rounded-3xl bg-[#2553eb] border-2 border-black hover:bg-blue-600 text-white cursor-pointer"
            >
              Edit Profile
            </button>
            <button

              className="w-32 h-12 rounded-3xl mt-4 bg-red-500 border-2 border-black hover:bg-red-600 hover:border-black hover:text-white text-white cursor-pointer"
            >
              Delete Profile
            </button>
            {/* <button className="w-28 h-12 rounded-3xl mt-4 bg-blue-200 border-2 border-black hover:bg-blue-400 hover:text-white cursor-pointer">
              Your Posts
            </button>
            <button className="w-28 h-12 rounded-3xl mt-4 bg-blue-200 border-2 border-black hover:bg-blue-400 hover:text-white cursor-pointer">
              Doubts Asked
            </button> */}
          </div>

        </div>


      </div>
    </div>
  );
}

export default Profilecomp;


// // Profilecomp.jsx
// import React from "react";

// function Profilecomp({ data, onEditClick }) {
//   return (
//     <div className="">
//       <div>
//         {/* Assuming 'profileImage' is a key in your data */}
//         <img
//           src={data && data.profileImage}
//           className="mt-4 mb-4 rounded-xl w-full px-48 h-40"
//           alt="Profile"
//         />
//       </div>
//       <div className="flex mr-0">
//         <div className="ml-48 mt-4 pl-8">
//           <img className="w-32 h-32 bg-blue-100 rounded-full border-2 border-2xl border-black" />
//         </div>
//         <div className="flex flex-col w-2/5 h-32 justify-between ml-10">
//           {/* Profile details go here */}
//           <div className="flex justify-between">
//             <p className="ml-6 pt-4 font-semibold text-2xl">{data && data.name}</p>
//             <p className="pt-4 font-normal text-xl">{data && data.city}</p>
//           </div>
//           <div className="ml-6 mt-2 text-xl">{data && data.role}</div>
//           <div className="flex justify-start items-center space-x-16">
//             <button
//               onClick={onEditClick}
//               className="ml-10 w-28 h-12 mt-4 rounded-3xl bg-[#2553eb] border-2 border-black hover:bg-blue-600 text-white cursor-pointer"
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profilecomp;

