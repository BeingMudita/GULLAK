import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdOutlineDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);

    return (
        <div className="relative">
            <button
                className="inline-flex items-center gap-2 text-[13px] font-medium bg-[#D2B48C]/40 text-[#8B4513] shadow-md border border-[#8B4513] rounded py-2 px-4 transition-all duration-300 ease-in-out hover:bg-[#8B4513] hover:text-white"
                onClick={() => setOpenDatePicker(true)}
            >
                <MdOutlineDateRange className="text-lg" />
                {date ? moment(date).format("DD MMM YYYY") : moment().format("DD MMM YYYY")}
            </button>

            {openDatePicker && (
                <div className="overflow-y-scroll p-5 bg-[#D2B48C]/40 rounded-lg relative pt-9 ">
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 border border-white/30 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setOpenDatePicker(false)}
                    >
                        <MdClose className="text-xs" />
                    </button>

                    <DayPicker
                        captionLayout="dropdown-buttons"
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        pagedNavigation
                    />
                </div>
            )}
        </div>
    );
};

export default DateSelector;
