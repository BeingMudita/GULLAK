import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

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
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login"); // Redirect if unauthorized
      }
    }
  };

  // Get all memories from the server
  const getAllMemories = async () => {
    try {
      const response = await axiosInstance.get("/get-memory");
      console.log("Memories response:", response.data); // Debugging
  
      if (response.data && response.data.stories) {
        setAllMemories(response.data.stories); // Change from response.data.memories
      }
    } catch (err) {
      console.log("Error fetching memories:", err);
    }
  };

  // Handle edit memory
  const handleEdit = (data) => {
  };

  // Handle view memory
  const handleViewMemory = (data) => {
  }

  // Handle update favourite status
  const updateisFavourite = async (data) => {
    const storyId = data._id;
    const newFavoriteStatus = !data.isFavorite; // Toggle like/dislike
  
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavorite: newFavoriteStatus,
      });
  
      if (response.data && response.data.message === "Memory updated successfully") {
        setAllMemories((prev) => {
          const updatedMemories = prev.map((item) =>
            item._id === storyId ? { ...item, isFavorite: newFavoriteStatus } : item
          );
  
          // **Sort immediately so liked ones come first**
          return updatedMemories.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
        });
      }
    } catch (err) {
      console.error("Error updating favourite status:", err.response?.data || err);
    }
  };
  
  
  
  

  useEffect(() => {
    getUserInfo();
    getAllMemories();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          {allMemories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {allMemories.map((item) => {
                return (
                  <TravelStoryCard key={item._id}
                  imageUrl = {item.imageUrl}
                  title = {item.title}
                  story = {item.story}
                  date = {item.memoryDate}
                  withPerson = {item.withPerson}
                  isFavorite = {item.isFavorite}
                  onEdit ={()=> handleEdit(item)}
                  onClick ={()=> handleViewMemory(item)} 
                  onFavouriteClick ={()=> updateisFavourite(item)}/>
                );
              })}
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
