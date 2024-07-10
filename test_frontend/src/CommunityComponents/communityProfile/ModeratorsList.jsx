import { useState, useEffect } from "react";
import { Avatar, Typography } from "@mui/material";

export default function ModeratorsList({ communityDetails }) {
  const [moderatorsData, setModeratorsData] = useState([]);
  
  useEffect(() => {
    if (communityDetails.moderators && communityDetails.moderators.length > 0) {
      setModeratorsData(communityDetails.moderators);
    }
  }, [communityDetails]);

  return (
    <div className="w-[100%] bg-[#f5f5f5] mt-[30px] border-[1px] border-solid rounded-[7px]">
      <p className="font-medium font-sans text-lg ml-[15px] mt-[10px]">Moderators</p>

      {moderatorsData.map((moderator) => (
        <div key={moderator._id} className="flex flex-row items-center m-[5px]">
            <Avatar
                className="m-[5px]"
                src={moderator.profilePicture}
                alt={moderator.firstName}
                sx={{ width: 36, height: 36 }}
            />
            <p className="font-sans font-normal text-lg pl-[15px]">
                {moderator.firstName} {moderator.lastName}
            </p>
        </div>
      ))}
    </div>
  );
}
