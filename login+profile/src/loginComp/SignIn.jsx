import React from "react";
import img from "./img.jpg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";

function SignInForm() {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        email: "",
        password: "",
        rememberMe: false, // Added rememberMe state
        showPassword: false, // Added showPassword state
    });

    // Load saved credentials from local storage on component mount
    React.useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");

        if (savedEmail && savedPassword) {
            setState((prevState) => ({
                ...prevState,
                email: savedEmail,
                password: savedPassword,
                rememberMe: true,
            }));
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

    const handleClickShowPassword = () => {
        setState({
            ...state,
            showPassword: !state.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleOnSubmit = (evt) => {
        evt.preventDefault();
        const { email, password, rememberMe } = state;

        if (password.length < 5) {
            alert("Password should be at least 5 characters long");
            return;
        }

        fetch("http://localhost:3000/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

            .then((response) => {
                // console.log(response);
                if (response.ok) {
                    // console.log(response.json());
                    alert("Logged in successfully.");
                    navigate("/profile");
                    return response.json();
                } else {
                    throw new Error("Login failed");
                }
            })
            .then((data) => {
                const token = data.token;
                // console.log(token);
                // Now you can use the token as needed
                localStorage.setItem("Token", token);
                localStorage.setItem("UserId", data.user._id);
                localStorage.setItem("UserEmail", data.user.email);
                localStorage.setItem("UserData", data.user);

                // If "Remember Me" is checked, save credentials to local storage
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                }

                // Redirect to the Home page
                // Navigate("/Home");
            })
            .catch((error) => {
                // Handle errors
                alert(`${error.message}: Invalid credentials. Please try again.`);
                console.error(error);
            });
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
                {/* <input /> */}
                {/* <InputLabel htmlFor="standard-adornment-password"></InputLabel> */}
                <Input
                    type={state.showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    className="custom-input"
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {state.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
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
                        <Link to="/login/forgotpassword">Forgot password?</Link>
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
