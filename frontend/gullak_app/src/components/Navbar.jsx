import React from "react";

import LOGO from "../assets/images/logo.png";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { search } from "../../../../backend";

const Navbar = ({userInfo, searchQuery, setSearchQuery}) => {

    const isToken = localStorage.getItem("token");
    const Navigate = useNavigate();

    const onLogout= () =>{
        localStorage.clear();
        Navigate("/login")// Redirect to login page
    }

    const handleSearch = ()=>{

    }

    const onClearSearch = ()=>{}

    return (
        <div className="bg-[#C4A98D] flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <img src={LOGO} alt="Memo" className="h-[60px] w-auto" />

            {isToken &&( 
                <>
                <SearchBar
                    value = {searchQuery}
                    onChange = {({target})=>{
                        setSearchQuery(target.value)
                    }}
                    handleSearch = {handleSearch}
                    onClearSearch = {onClearSearch}
                />
                <ProfileInfo userInfo={userInfo} onLogout={onLogout}/> {" "}
                </>
            )}
        </div>
    )
}

export default Navbar;