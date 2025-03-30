import React from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({storyInfo, type, onClose, getAllTravelStory })=>{

    const [title, setTitle] = React.useState("");
    const [storyimage, setStoryImage] = React.useState(null);
    const [story, setStory] = React.useState("");
    const [withPerson, setWithPerson] = React.useState([]);
    const [date, setDate] = React.useState(null);
    const [error, setError] = React.useState("");

    //Update Memory
    const updateMemory = async () => {

    }

    //Add Memory
    const addMemory = async () => {
        try{
            let imageUrl = "";
            //Uplad image
            if(storyimage){
                const imgUpLoadRes = await uploadImage(storyimage);
                imageUrl = imgUpLoadRes.imageUrl ||"";
            }

            const response = await axiosInstance.post("/add-memory", {
                title,
                story,
                imageUrl: imageUrl || "",
                withPerson,
                memoryDate: date
                ? moment(date).valueOf()
                : moment().valueOf(),
            });

            if (response.data && response.data.story){
                toast.success("Memory added successfully");
                getAllTravelStory();
                onClose();
            }
        }catch(err){
            console.log(err);
        }
    }
    
    const handleAddOrUpdateClick = async () => {
        if(!title || !story){
            setError("Please add title and memory.");
            return;
        }
        setError("");
        if(type === "edit"){
            updateMemory()
        }else{
            addMemory()
        }

    }
    const handleDeleteMemoImage = () => {}
    
    return(
        <div className="relative ">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Memory " : "Edit Travel Story"} 
                </h5>
                <div>
                    <div className="flex items-center gap-3  text-[#8B4513] bg-[#D2B48C]/40 p-2 rounded-l-lg">
                        {type === "add" ? <button className="btn-small" onClick={handleAddOrUpdateClick}>
                            <MdAdd className="text-lg"/> ADD MEMORY
                        </button>: <>
                            <button className="btn-small" onClick={handleAddOrUpdateClick}>
                                <MdUpdate className="text-lg"/> UPDATE MEMORY
                            </button>

                        </>}

                        <button className="" onClick={onClose}>
                            <MdClose className="text-xs text-slate-400"/>
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </div>

            <div>
                <div className="flex-1 flex flex-col gap-2 pt-4">
                    <label className="input-label">TITLE</label>
                    <input type="text" className="text-2xl text-slate-950 outline-none" placeholder="An outing with friends" value={title} onChange={({target})=> setTitle(target.value)}>
                    </input>
                    <div className="my-3">
                        <DateSelector date = {date} setDate = {setDate} />
                    </div>
                    
                    <ImageSelector image = {storyimage} setImage = {setStoryImage}  handleDeleteImage = {handleDeleteMemoImage} />

                    <div className="flex flex-col gap-2 mt-4">
                        <label className="input-label ">STORY</label>
                        <textarea name="" id="" type="text" className="text-sm bg-[#D2B48C]/40 border border-[#8B4513] outline-none bg-slate-50 p-2 rounded" placeholder="Your memory" rows={10} value={story} onChange={({target})=>setStory(target.value)}></textarea>
                    </div>

                    <div className="pt-3">
                        <label className="input-label ">PERSON</label>
                        <TagInput tags={withPerson} setTags={setWithPerson} placeholder="Add person" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory;