import React, { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./App.css";
// import img4 from "./img4.png"
// import SignInForm from "./SignIn";
// import SignUpForm from "../SignUp";
// import Post from "./Post";
import Sign from "./Sign";
import ForgotPassword from "./ForgotPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import OTPPage from "./OTP";


export default function App() {
  // const [type, setType] = useState("signIn");
  // const handleOnClick = text => {
  //   if (text !== type) {
  //     setType(text);
  //     return;
  //   }
  // };
  // const containerClass =
  //   "container " + (type === "signUp" ? "right-panel-active" : "");

  return (

    <Router>
      <Routes>
        <Route exact path="/" element={<Sign />} />
        <Route path="/OTP" element={<OTPPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} /> {/* Define the route to ForgotPassword */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}