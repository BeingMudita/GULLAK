import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");
  
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
  
      console.log("Signup Response:", response.data); // ✅ Debug API response
  
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again.");
        console.error("Response does not contain accessToken:", response.data); // Debug
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error);
      setError(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };
  
  return (
    <div className="h-screen bg-[#C4A98D] overflow-hidden relative">
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        
        {/* Left Side (Image & Text) */}
        <div className="w-2/4 h-[90vh] bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50 flex flex-col justify-end">
          <h4 className="text-5xl text-white font-semibold leading-[58px] mb-2">
            Join & Store Memories
          </h4>
          <p className="text-[15px] text-white leading-6 pr-7">
            Create an account to start storing your memories and share them with your loved ones.
          </p>
        </div>

        {/* Right Side (Signup Form) */}
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 z-50">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <input 
              type="text" 
              placeholder="Email" 
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit" className="btn-primary">
              SIGNUP
            </button>

            <p className="text-xs text-[#8E7654] text-center my-4">Or</p>

            <button
              type="button" // ✅ Changed to "button" to prevent form submission
              className="btn-primary btn-light"
              onClick={() => navigate("/login")} // ✅ Fixed incorrect navigation function
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
