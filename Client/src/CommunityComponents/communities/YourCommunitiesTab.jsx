import { useState, useEffect } from "react";
import { Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function YourCommunitiesTab() {
  const navigate = useNavigate();
  const [communityList, setCommunityList] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const communities = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/profile/getUserMemberCommunity`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });

        const data = await response.json();
        // console.log(data);
        setCommunityList(data.data.community);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    communities();
  }, []);

  const handleCommunityClick = (communityName) => {
    navigate(`/Community/CommunityProfile/${communityName}`);
  };

  return (
    <div className="max-h-[24rem] overflow-auto flex-col flex-[1_1_0.8] h-[100%]">
      {communityList.length === 0 ? (
        <p className='text-center font-bold font-mono text-3xl mt-32 overflow-hidden'>You haven't joined any communities yet.</p>
      ) : (
        communityList.map((community) => (
          <div className="pt-3 bg-white" key={community.id}>
            <div
              className="mx-2 md:mx-5 mb-1 flex flex-row bg-white items-center"
              onClick={() => handleCommunityClick(community.name)}
            >
              <Avatar
                alt={community.name}
                src={community.picture}
                sx={{ width: 46, height: 46 }}
                className="mb-2 md:mb-0"
              />
              <Typography
                variant="h6"
                className="bg-white cursor-pointer pl-2 md:pl-4"
              >
                {community.name}
              </Typography>
            </div>
            <hr className="h-[1px]" />
          </div>
        ))
      )}
    </div>
  );
}
