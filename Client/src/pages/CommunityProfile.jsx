import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import ProfileCard from "../CommunityComponents/communityProfile/ProfileCard"
import Feed from "../CommunityComponents/communityProfile/Feed"
import UpdateCommunity from "../CommunityComponents/communityProfile/UpdateCommunity"
import MembersList from "../CommunityComponents/communityProfile/MembersList"
import ModeratorsList from "../CommunityComponents/communityProfile/ModeratorsList"
import Header from "../ProfileComponents/Header"

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommunityProfile() {
    const { name } = useParams();
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
    const [communityData, setCommunityData] = useState({})

    useEffect(() => {
        const token = localStorage.getItem("Token");
        const fetchCommunityData = async () => {
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
                console.log(data.data);
                setCommunityData(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCommunityData();
    }, [name]);

    const handleUpdateButtonClick = () => {
        setIsUpdateFormVisible(true);
    };

    return (
        <div>
            <Header />
            <div className="overflow-auto">
                {isUpdateFormVisible ? (
                    <UpdateCommunity
                        onCloseForm={() => setIsUpdateFormVisible(false)}

                    />
                ) : (
                    <div className="w-screen h-screen flex justify-center overflow-auto">
                        <div className="w-[45%] m-[15px] mt-[-75px]">
                            <ProfileCard communityDetails={communityData} onUpdateButtonClick={handleUpdateButtonClick} />
                            <Feed communityName={name} />
                        </div>
                        <div className="w-[350px] m-[15px]">
                            <MembersList communityDetails={communityData} />
                            <ModeratorsList communityDetails={communityData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
