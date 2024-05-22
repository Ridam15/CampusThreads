//Signin.jsx
import React from "react";
import img from "./img.jpg";
import { Link } from "react-router-dom";

function SignInForm() {
    const [state, setState] = React.useState({
        email: "",
        password: "",
        rememberMe: false, // Added rememberMe state
    });

    // Load saved credentials from local storage on component mount
    React.useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");

        if (savedEmail && savedPassword) {
            setState({
                ...state,
                email: savedEmail,
                password: savedPassword,
                rememberMe: true,
            });
        }
    }, []);

    const handleChange = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        if (name === "email") {
            // Check if the email length exceeds 30 characters
            if (value.length > 30) {
                // If it does, truncate it to the first 30 characters
                setState({
                    ...state,
                    [name]: value.slice(0, 30),
                });
                alert("Email should not exceed 30 characters");
            } else {
                setState({
                    ...state,
                    [name]: value,
                });
            }
        } else {
            // Check if the value length exceeds 15 characters for password and confirm password
            if (value.length > 15) {
                // If it does, truncate it to the first 15 characters
                setState({
                    ...state,
                    [name]: value.slice(0, 15),
                });
                alert("Password should not exceed 15 characters");
            } else {
                setState({
                    ...state,
                    [name]: value,
                });
            }
        }
    };


    const handleRememberMeChange = (evt) => {
        const isChecked = evt.target.checked;
        setState({
            ...state,
            rememberMe: isChecked,
        });
    };

    const handleOnSubmit = (evt) => {
        evt.preventDefault();

        const { email, password, rememberMe } = state;

        // If "Remember Me" is checked, save credentials to local storage
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
        }

        alert(`You are login with email: ${email} and password: ${password}`);

        for (const key in state) {
            setState({
                ...state,
                [key]: "",
            });
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <div className="logo">
                    <p>
                        <img src={img} alt=" " /> CampusThreads
                    </p>
                </div>
                <h1>Sign Into Your Account</h1>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                />
                <div className="con">
                    <div className="remb">
                        <label className="label">
                            <input
                                type="checkbox"
                                className="remember"
                                id="remember"
                                checked={state.rememberMe}
                                onChange={handleRememberMeChange}
                            />{" "}
                            Remember Me
                        </label>
                    </div>
                    <div className="for-pa">
                        <Link to="/forgotpassword">Forgot password?</Link>
                    </div>
                </div>
                <button>Sign In</button>
                {/* <div className="alt-s">
                    <span>OR</span>
                </div>
                <div className="social-container">
                    <a href="#" class="social"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social">
                        <i className="fab fa-google"></i>
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div> */}
            </form>
        </div>
    );
}

export default SignInForm;
