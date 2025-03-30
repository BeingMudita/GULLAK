import moment from "moment";
import React from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";


const ViewMemory = ({storyInfo, onClose, onEditClick, onDeleteClick}) => {
    return(
        <div className="relative ">
            <div className="flex items-center justify-end">
                <div>
                    <div className="flex items-center gap-3  text-[#8B4513] bg-[#D2B48C]/40 p-2 rounded-l-lg">
                        <button className="btn-small" onClick={onEditClick}>
                                <MdUpdate className="text-lg"/> UPDATE MEMORY
                        </button>

                        <button className="btn-small" onClick={onDeleteClick}>
                                <MdDeleteOutline className="text-lg"/> DELETE
                        </button>
                
                        <button className="" onClick={onClose}>
                            <MdClose className="text-xs text-slate-400"/>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex-1 flex flex-col gap-2 py-4">
                    <h1 className="text-2xl text-slate-950">{storyInfo && storyInfo.title}</h1>
                    <div className=" flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">{storyInfo && moment(storyInfo.memoryDate).format("DD MM YYYY")}</span>

                        <div className="inline flex items-center gap-2 text-[#8B4513] bg-[#D2B48C]/40 rounded px-2 py-1">
                            {storyInfo && storyInfo.withPerson.map((person, index) => storyInfo.withPerson.length == index + 1 ? `${person}` : `${person}, `)}
                        </div>
                    </div>
                </div>
                <img src={storyInfo && storyInfo.imageUrl} alt="Selected" className="w-full h-full object-cover rounded-lg" />
                <div className="mt-4 ">
                    <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo && storyInfo.story}</p>

                </div>
            </div>
        </div>

    )
}

export default ViewMemory;