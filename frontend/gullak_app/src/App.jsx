import { BrowserRouter as Router, Routes, Navigate, Route } from "react-router-dom";
import React from "react";

import Login from "./pages/Auth/login";
import Signup from "./pages/Auth/signup";
import Home from "./pages/Home/Home";

const App = () => {
  return(
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" exact element = {<Home />} />
          <Route path="/login" element = {<Login />} />
          <Route path="/signup" element = {<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}
export default App;