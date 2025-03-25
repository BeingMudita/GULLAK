import React from "react";

import LOGO from "../assets/images/logo.png";

const Navbar = () => {
    return (
        <div className="bg-[#C4A98D] flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <img src={LOGO} alt="Memo" className="h-[60px] w-auto" />
        </div>
    )
}

export default Navbar;