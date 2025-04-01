import React from "react";

const EmptyCard = ({ message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#D2B48C]/10">
      <div className="bg-[#D2B48C]/40 border border-[#8B4513] p-6 rounded-xl shadow-lg w-3/4 md:w-1/2 text-center">
        <p className="text-lg font-semibold text-[#8B4513]">{message}</p>
      </div>
    </div>
  );
};

export default EmptyCard;
