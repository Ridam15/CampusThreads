import { useState, useEffect } from "react"; // Correct the import statement
import { Avatar } from "@mui/material";

export default function MembersList({ communityDetails }) {
  const [membersData, setMembersData] = useState([]);

  useEffect(() => {
    if (communityDetails.members && communityDetails.members.length > 0) {
      setMembersData(communityDetails.members);
    }
  }, [communityDetails]);

  return (
    <div className="w-[100%] bg-[#f5f5f5] mt-[10px] border-[1px] border-solid rounded-[7px] overflow-auto max-h-96 relative">
      <p className="font-medium font-sans text-lg ml-[15px] mt-[10px]">
        {membersData.length} members
      </p>

      {membersData.map((member) => (
        <div key={member._id} className="flex flex-row items-center m-[5px]">
          <Avatar
            className="m-[5px]"
            src={member.profilePicture}
            alt={member.firstName}
            sx={{ width: 36, height: 36 }}
          />
          <p className="font-sans font-normal text-lg pl-[5px]">
            {member.firstName} {member.lastName}
          </p>
        </div>
      ))}
    </div>
  );
}
