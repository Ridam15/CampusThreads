// App.jsx
import React, { useState } from "react";
import Edit from "./ProfileComponents/Edit";
import Nav from "./ProfileComponents/Nav";
import Profilecomp from "./ProfileComponents/coProfile";
import Projects from "./ProfileComponents/Projects";
import Experience from "./ProfileComponents/Experience";
import Tab from "./ProfileComponents/TabSwitch"
import About from "./ProfileComponents/About";
// import "./index.css";
import "./Profile.css";
import Header from "./ProfileComponents/Header";



function Profile() {
    const [showEdit, setShowEdit] = useState(false);

    const handleEditClick = () => {
        setShowEdit(true);
    };

    const handleBackToApp = () => {
        setShowEdit(false);
    };

    return (
        <div className="Profile">
            <Header />
            <div className="mt-12 shadow-2xl bg-slate-50 mx-9  relative ">
                {/* <Nav /> */}
                {showEdit ? (
                    <Edit onBackToApp={handleBackToApp} />
                ) : (
                    <div>
                        <Profilecomp onEditClick={handleEditClick} />
                        {/* <Experience /> */}
                        <About />
                        <Tab />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;


