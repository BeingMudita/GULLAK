import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Modal from "react-modal";
import { MdAdd } from "react-icons/md";
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewMemory from "./viewMemory";
import EmptyCard from "../../components/Cards/EmptyCard";


const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("")
  const [userInfo, setUserInfo] = React.useState(null);
  const [allMemories, setAllMemories] = React.useState([]);
  const [openAddEditModal, setOpenAddEditModal] = React.useState({
    isShown : false,
    type: "add",
    data: null,
  });

  const[openViewModal, setOpenViewModal] = React.useState({
    isShown : false,
    data: null,
  });

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
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: data,
    });
  };

  // Handle view memory
  const handleViewMemory = (data) => {
    setOpenViewModal({
      isShown: true,
      data
    });
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
  
        // **Show toast notification**
        toast.success(newFavoriteStatus ? "Added to Favorites!" : "Removed from Favorites!");
      }
    } catch (err) {
      console.error("Error updating favourite status:", err.response?.data || err);
      toast.error("Failed to update favorite status! ");
    }
  };
  
  // Delete Memory
  const deleteMemory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-memory/${storyId}`);
      if(response.data && !response.data/error){
        toast.error("Story deleted successfully!");
        setOpenViewModal((prevState)=>({...prevState, isShown: false}));
        getAllMemories();
      }
    }catch(error){
      console.log("Something went wrong. Please try again.");
    }

  }
  
  //Search Memory
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get(`/search`, {
        params: {
          query,
        }
      });
      if(response.data && response.data.stories){
        setFilterType("search");
        setAllMemories(response.data.stories);
      }
      
    }catch(error){
      console.log("Something went wrong. Please try again.");
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllMemories();

  }
  
  
  

  useEffect(() => {
    getUserInfo();
    getAllMemories();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      onSearchNote = {onSearchStory} handleClearSearch={handleClearSearch}
      />

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
                  onClick ={()=> handleViewMemory(item)} 
                  onFavouriteClick ={()=> updateisFavourite(item)}/>
                );
              })}
            </div>
          ) : (
            <EmptyCard message="Start you digital journal! Click the ADD button to start... Lets get started"/>
          )}
        </div>
        <div className="w-[320px]">
          <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
            <div className="p-3">
              <DayPicker
                captionLayout = "dropdown-button"
                mode= "range"
                selected = {dateRange}
                onSelect= {handleDayClick}
                pagedNavigation 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit memory model */}
      <Modal
        isOpen= {openAddEditModal.isShown}
        onRequestClose={() => {}}
        style ={{
          overlay:{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }
        }}
        appElement={document.getElementById("root")}
        className="model-box"

      >
        <AddEditTravelStory 
          type = {openAddEditModal.type}
          storyInfo = {openAddEditModal.data}
          onClose = {()=> setOpenAddEditModal({isShown: false, type: "add", data: null})}
          getAllTravelStory = {getAllMemories}  
          setStories={setAllMemories}
        />
      </Modal>
      
      {/* View memory */}
      <Modal
        isOpen= {openViewModal.isShown}
        onRequestClose={() => {}}
        style ={{
          overlay:{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewMemory
          storyInfo = {openViewModal.data|| null}
          onClose={()=>{
            setOpenViewModal((prevState)=>({...prevState, isShown: false}));
          }}
          onEditClick={()=>{
            setOpenViewModal((prevState)=>({...prevState, isShown: false}));
            handleEdit(openViewModal.data|| null);
          }}
          onDeleteClick={()=>{
            deleteMemory(openViewModal.data || null);
          }}>
        </ViewMemory>
      </Modal>

      <button className="w-16 h-16 flex items-center justify-center rounded-full bg-[#C4A98D] fixed bottom-10 right-10 shadow-lg hover:shadow-xl transition duration-300 ease-in-out z-10"
      onClick={() => {
        setOpenAddEditModal({
          isShown: true,
          type: "add",
          data: null,
        });
      }}>
        <MdAdd className="text-[32px] text-white"/>
      </button>
      <ToastContainer/>
    </>
  );
};

export default Home;
