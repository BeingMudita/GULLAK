import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState(null);
  const [allMemories, setAllMemories] = React.useState([]);

  // Get user info from local storage
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response.status === 401 ) {
        localStorage.clear();
        navigate("/login"); // Redirect if unauthorized
      }
    }
  };

  // Get all memories from the server
  const getAllMemories = async () => {
    try{
      const response = await axiosInstance.get("/get-memory");
      if (response.data && response.data.memories) {
        setAllMemories(response.data.memories);
      }
    }catch(err){
      console.log("Error fetching memories:", err);
    }
  }
  

  useEffect(() => {
    getUserInfo();
    getAllMemories();
  }, []);

  return (
    <>
      <Navbar userInfo = {userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          {allMemories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {allMemories.map((item) => (
              <TravelStoryCard key={item._id} />
            ))}
            </div>
          ) : (
            <>Empty card here</>
        )}
        </div>
        <div className="w-[320px]"></div>
      </div>
      
    </>
  );
};

export default Home;
