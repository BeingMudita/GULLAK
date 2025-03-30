import React from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";

const AddEditTravelStory = ({storyInfo, type, onClose, getAllTravelStory })=>{

    const [title, setTitle] = React.useState("");
    const [storyimage, setStoryImage] = React.useState(null);
    const [story, setStory] = React.useState("");
    const [withPerson, setWithPerson] = React.useState([]);
    const [date, setDate] = React.useState(null);
    
    const handleAddOrUpdateClick = async () => {

    }

    return(
        <div>
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
                    
                    <ImageSelector image = {storyimage} setImage = {setStoryImage} />

                    <div className="flex flex-col gap-2 mt-4">
                        <label className="input-label">STORY</label>
                        <textarea name="" id="" type="text" className="text-sm bg-[#D2B48C]/40 text-[#8B4513] outline-none bg-slate-50 p-2 rounded" placeholder="Your memory" rows={10} value={story} onChange={({target})=>setStory(target.value)}></textarea>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory;