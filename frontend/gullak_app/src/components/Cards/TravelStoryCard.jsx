import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FaHeart} from "react-icons/fa6"
import { GrMapLocation } from "react-icons/gr"; // Corrected spelling
import moment from "moment";

const TravelStoryCard = ({ imageUrl, 
    title,
    story,
    date,
    withPerson,
    isFavorite,
    onFavouriteClick,
    onClick
 }) => {
    return (
        <div className='border rounded-lg bg-white hover:shadow-lg hover-shadow-slate-300 transition duration-200 ease-in-out relative cursor-pointer'>
            <img src={imageUrl} alt={title} className='w-full h-56 object-cover'
            onClick={onClick} />

            <button 
            className='absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 cursor-pointer' 
            onClick={onFavouriteClick}
            >
                <FaHeart className={`icon-button ${isFavorite ? "text-red-500" : "text-slate-400"}`} />
            </button>


            <div className='p-4 ' onClick={onClick}>
                <div className='flex items-center gap-3'>
                    <div className='flex-1'>
                        <h6 className='text-sm font-medium'>{title}</h6>
                        <span className='text-xs text-slate-500'>
                            {date ? moment(date).format("dd MMM yyyy") : "-"}
                        </span>

                    </div>
                </div>
                <p className='text-xs text-slate-600 mt-2 '>{story?.slice(0,60)}</p>
                <div className='inline-flex items-center gap-2 text-[13px] text-[#8B4513] bg-[#D2B48C]/40 rounded px-2 py-1 mt-3'>

                    {withPerson.map((person,index)=> withPerson.length == index +1 ? `${person}`: `${person}`)}
                </div>
            </div>

        </div>
    )
}

export default TravelStoryCard;
