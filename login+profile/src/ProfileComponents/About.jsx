import React, { useState, useEffect } from 'react'

const About = () => {

  const [userData, setUserData] = useState({ about: '' });

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/profile/getUserDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();
        // console.log(data.data);
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div><hr className="mt-8 w-full "></hr>
      <div className=" text-align-center ml-48 pl-5 mt-8">
        <p className="font-bold text-3xl">About</p>
        <div className="mt-4 font-normal text-xl">
          <div
            dangerouslySetInnerHTML={{
              __html: userData.additionalDetails ? userData.additionalDetails.about : '',
            }}
          />
        </div>

      </div></div>
  )
}

export default About;

// import React from "react";

// const About = ({ data }) => {
//   return (
//     <div>
//       <hr className="mt-8 w-full "></hr>
//       <div className=" text-align-center ml-48 pl-5 mt-8">
//         <p className="font-bold text-3xl">About</p>
//         <div className="mt-4 font-normal text-xl">
//           {data && data.about}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;
