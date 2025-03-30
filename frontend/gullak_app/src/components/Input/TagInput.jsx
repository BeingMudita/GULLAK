import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {

    const [inputValue, setInputValue] = useState([]);
    const addNewTag = () => {
        if(inputValue.trim() !== "" ){
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }else{
            alert("Please enter a valid tag or tag already exists.");
        }
    }

    const handleInputChange = (event)=>{
        setInputValue(event.target.value);
    }

    const handleKeyDown = (event) => {
        if(event.key === "Enter"){
            addNewTag();   
        }
    }

    const handleRemoveTags = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));

    }

    return(
        <div>
            {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-2 bg-[#D2B48C]/40 text-[#8B4513] rounded px-2 py-1 text-sm">{tag}
                            <button onClick={()=>handleRemoveTags(tag)}>
                                <MdClose className="text-xs text-slate-400" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-4 mt-3">
                <input
                    type="text"
                    value={inputValue}
                    className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
                    placeholder="Add your beloved"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="w-8 h-8 flex items-center justify-center rounded bg-[#D2B48C]/40 border border-[#8B4513] cursor-pointer"
                    onClick={addNewTag}
                >
                    <MdAdd className="text-xs text-slate-400" />
                </button>


            </div>
        </div>
    )
}

export default TagInput;