import React from "react";
import { getInitials } from "../../utils/helper";   

const ProfileInfo = ({ userInfo, onLogout }) => {
    if (!userInfo) {
        return null; // Prevent rendering if userInfo is null
    }

    return (
        userInfo &&( 
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 bg-slate-100 font-medium">
                    {getInitials(userInfo.fullName || "U")}
                </div>
                <p className="text-sm font-medium">{userInfo.fullName || "Guest"}</p>
                <button className="text-sm text-slate-700 underline" onClick={onLogout}>
                    Logout
                </button>
            </div>
        )
    );
};

export default ProfileInfo;
