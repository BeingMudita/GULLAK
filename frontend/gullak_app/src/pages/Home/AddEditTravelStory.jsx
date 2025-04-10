import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStory, setStories }) => {
    const [title, setTitle] = useState(storyInfo?.title || ""); 
    const [storyimage, setStoryImage] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [withPerson, setWithPerson] = useState(storyInfo?.withPerson || []);
    const [date, setDate] = useState(storyInfo?.memoryDate || null);
    const [error, setError] = useState("");

    const addMemory = async () => {
        try {
            let imageUrl = "";
            if (storyimage) {
                const imgUpLoadRes = await uploadImage(storyimage);
                imageUrl = imgUpLoadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-memory", {
                title,
                story,
                imageUrl,
                withPerson,
                memoryDate: date ? moment(date).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Memory added successfully");
                getAllTravelStory();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const updateMemory = async () => {
        const storyId = storyInfo._id;
        try {
            let imageUrl = storyInfo.imageUrl || "";
            if (storyimage && typeof storyimage === "object") {
                const uploadImageRes = await uploadImage(storyimage);
                imageUrl = uploadImageRes.imageUrl || "";
            }

            const updatedStory = {
                title,
                story,
                imageUrl,
                withPerson,
                memoryDate: date ? moment(date).valueOf() : moment().valueOf(),
            };

            const response = await axiosInstance.put(`/edit-memory/${storyId}`, updatedStory);

            if (response.data && response.data.story) {
                toast.success("Memory updated successfully");
                if (setStories) {
                    setStories((prevStories) =>
                        prevStories.map((story) =>
                            story._id === storyId ? { ...story, ...updatedStory } : story
                        )
                    );
                } else {
                    getAllTravelStory();
                }
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const handleDeleteMemoImage = async () => {
        try {
            const deleteImgRes = await axiosInstance.delete("/delete-image", {
                params: { imageUrl: storyInfo.imageUrl },
            });
            if (deleteImgRes.data) {
                setStoryImage(null);
                toast.success("Image deleted successfully");
            }
        } catch (err) {
            toast.error("Failed to delete image");
        }
    };

    const handleAddOrUpdateClick = async () => {
        if (!title || !story) {
            setError("Please add title and memory.");
            return;
        }
        setError("");
        if (type === "edit") {
            updateMemory();
        } else {
            addMemory();
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Memory " : "Update Memory"} 
                </h5>
                <div>
                    <div className="flex items-center gap-3 text-[#8B4513] bg-[#D2B48C]/40 p-2 rounded-l-lg">
                        {type === "add" ? (
                            <button className="btn-small" onClick={handleAddOrUpdateClick}>
                                <MdAdd className="text-lg" /> ADD MEMORY
                            </button>
                        ) : (
                            <button className="btn-small" onClick={handleAddOrUpdateClick}>
                                <MdUpdate className="text-lg" /> UPDATE MEMORY
                            </button>
                        )}
                        <button onClick={onClose}>
                            <MdClose className="text-xs text-slate-400" />
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </div>
            <div>
                <div className="flex flex-col gap-2 pt-4">
                    <label className="input-label">TITLE</label>
                    <input type="text" className="text-2xl text-slate-950 outline-none" placeholder="An outing with friends" value={title} onChange={({ target }) => setTitle(target.value)} />
                    <div className="my-3">
                        <DateSelector date={date} setDate={setDate} />
                    </div>
                    <ImageSelector image={storyimage} setImage={setStoryImage} handleDeleteImage={handleDeleteMemoImage} />
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="input-label">STORY</label>
                        <textarea className="text-sm bg-[#D2B48C]/40 border border-[#8B4513] outline-none p-2 rounded" placeholder="Your memory" rows={10} value={story} onChange={({ target }) => setStory(target.value)}></textarea>
                    </div>
                    <div className="pt-3">
                        <label className="input-label">PERSON</label>
                        <TagInput tags={withPerson} setTags={setWithPerson} placeholder="Add person" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
