import React, {useState} from "react";

import { Navigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email");
      return;
    }
    if(!password){
      setError("Please enter a password");
      return;
    }
    setError("");
    // API call to login
    try{
      const response = await axiosInstance.post("/login",{
        email: email,
        password: password,
      });
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again later.");
      }
    }
  }




  return (
    <div className="h-screen bg-[#C4A98D] overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box -bottom-40 right-1/2"></div>
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
      <div className="w-2/4 h-[90vh] bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50 flex flex-col justify-end">
          <h4 className="text-5xl font-semibold leading-[58px] mb-2">
            Capture your<br /> Memories
          </h4>
          <p className="text-[15px] leading-6 pr-7">
            A place to store your memories and share them with your loved ones.
          </p>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 z-50">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input type="text" placeholder="Email" className="input-box"
            value={email}
            onChange={({target}) => {setEmail(target.value)}}
            />
            <PasswordInput
            value={password}
            onChange={({target}) => {setPassword(target.value)}}/>

            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" className="btn-primary">
              LOGIN
            </button>
            <p className="text-xs text-[#8E7654] text-center my-4">Or</p>

            <button
            type="submit"
            className="btn-primary btn-light"
            onClick={()=>{
              navigate("/signup");
            }}>
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;