import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    return (
        <div className="flex items-center bg-[#E3D5C5] px-5 py-2.5 rounded-full mb-3 gap-3 border border-[#C4A98D] focus-within:ring-2 focus-within:ring-[#A38A6D]">
            <input
                type={isShowPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent outline-none text-[#6D5641] placeholder:text-[#8E7654]"
            />
            {isShowPassword ? (
                <FaRegEye
                    size={22}
                    className="text-[#8E7654] cursor-pointer"
                    onClick={() => setIsShowPassword(false)}
                />
            ) : (
                <FaRegEyeSlash
                    size={22}
                    className="text-[#8E7654] cursor-pointer"
                    onClick={() => setIsShowPassword(true)}
                />
            )}
        </div>
    );
};

export default PasswordInput;
