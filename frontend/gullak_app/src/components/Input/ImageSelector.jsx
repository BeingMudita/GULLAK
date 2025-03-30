import React, { useRef, useState, useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage , handleDeleteImage}) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const onChooseFile= ()=>{
        inputRef.current.click();
    } 

    const handleImageChange = (event)=>{
        const file = event.target.files[0];
        if(file){
            setImage(file);
        }
    }

    const handleRemoveImage =()=>{
        setImage(null);
        handleDeleteImage();
    }

    useEffect(()=>{
        if(typeof image === "string"){
            setPreviewUrl(image);
        }else if(image){
            setPreviewUrl(URL.createObjectURL(image));
        }else{
            setPreviewUrl(null);
        }
        return () => {
            if(previewUrl && typeof previewUrl === "string" && !image){
                URL.revokeObjectURL(previewUrl);
            }
        }
    },[image]);
    return(
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image? <button className="w-full h-[220px] flex flex-cols items-center justify-center gap-4 bg-[#D2B48C]/40 border border-[#8B4513] rounded " onClick={()=> onChooseFile()}>
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#8B4513]/40 border border-[#8B4513]">
                    <FaRegFileImage className="text-xl text-[#8B4513]" />
                </div>
                <p className="text-sm text-[#8B4513]">Browse image to upload</p>
            </button>:
                <div className="w-full relative">
                    <img
                        src={previewUrl}
                        alt="Selected"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <button className="btn-small btn-delete absolute top-2 right-2" onClick={handleRemoveImage}>
                        <MdDeleteOutline className="text-lg" />
                    </button>
                </div>
            }
        </div>
    )
}

export default ImageSelector;