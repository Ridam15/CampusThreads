import CreateIcon from "@mui/icons-material/Create";
import React, { useState, useEffect } from "react";
import InputOption from "./InputOption.jsx";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import Post from "./Post.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  // const [allDetails, setAllDetails] = useState([]);



  useEffect(() => {
    // Make a GET request to fetch posts
    const token = localStorage.getItem("Token");
    // console.log(token);
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
              // Add any additional headers as needed
            },
          }
        );
        // console.log(response.json());

        if (response.ok) {
          const data = await response.json();
          // setAllDetails(data.data);
          console.log(data.data);
          setPosts(data.data);
          // console.log(posts);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="flex-[0.2] ml-24 w-3/5">
      {/* <div className='bg-[white] mt-2.5 mb-5 pb-5 p-2.5 rounded-[10px]'>
        <div className='ml-[2vh] mt-[1vh]'>
          <div className='border flex text-[gray] h-[5vh] pl-[15px] p-2.5 rounded-[30px] border-solid border-[lightgray]'>
            <CreateIcon />
          </div>
          <form className='flex w-full justify-evenly'>
            <button 
                type='text' 
                placeholder='start a post'
                className='w-[70%] bg-[#f3f2ef] text-[gray] rounded-[10px] border-[none] hover:cursor-pointer'
            >
                Start a post
            </button>
            <button 
                type='submit'
                className='w-[18%] text-[white] bg-[#3480cd] rounded-[15px] border-2 border-solid border-[white] hover:bg-[white] hover:text-[#3480cd] hover:transition-all hover:duration-[0.5s] hover:ease-[ease-in-out] hover:font-semibold hover:border-2 hover:border-solid hover:border-[#3480cd]'
            >
                Send
            </button>
          </form>
        </div>

        <div className='flex justify-evenly mt-[2%]'>
          <InputOption Icon={ImageIcon} title='Photo' color='#70B5F9' />
          <InputOption Icon={SubscriptionsIcon} title='Video' color='#E7A33E' />
        </div>
      </div> */}
      {posts.map((post) => (
        <Post
          key={post._id}
          id={post._id}
          name={post.createdBy.firstName + " " + post.createdBy.lastName}
          tags={post.tags}
          description={
            post.community ? post.community.name : "Deleted Community"
          }
          message={post.content}
          photoUrl={post.fileUrl} // Assuming the field is named photoUrl
          profileImg={post.createdBy.profilePicture}
        />
      ))}
      {/* 
      <Post
        name="Narendra Modi"
        description="Started with chai, now stirring policies"
        message="Modi's chai might be piping hot, but his speeches are scalding! #TeaAndTactics."
        profileImg="https://bsmedia.business-standard.com/_media/bs/img/article/2015-05/05/full/1430823912-5957.jpg"
      />

      <Post
        name="Arvind Kejriwal"
        description="Muffler-wielding hero of commoners."
        message="Kejriwal's muffler - because solving political problems is a lot like staying warm in Delhi winters: wrap it up!"
        profileImg="https://indianmemetemplates.com/wp-content/uploads/Arvind-Kejriwal-wearing-floral-crown-843x1024.jpg"
      />

      <Post
        name="Rahul Gandhi"
        description="Politician by day, comedian undercover"
        message="They say laughter is the best medicine. Enter Rahul Gandhi – your friendly neighborhood political jester!"
        profileImg="https://i.ytimg.com/vi/jwrhqGqowyU/maxresdefault.jpg"
      />

      <Post
        name="Imran Khan"
        description="Once a cricket legend, now... well, still figuring out politics"
        message="Imran Khan's playbook: swing in cricket, swing in politics – some things never change. Is he running a country or just another innings?"
        profileImg="https://static.toiimg.com/photo/msid-76340696,imgsize-37436/76340696.jpg"
      /> */}
    </div>
  );
}
