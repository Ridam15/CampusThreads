import React from "react";
import img from "./img.jpg";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

function SignInForm() {
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        email: "",
        password: "",
        rememberMe: false, // Added rememberMe state
        showPassword: false, // Added showPassword state
    });
    const [loading, setLoading] = React.useState(false); // Added loading state

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
                toast.error("Email should not exceed 30 characters");
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
                toast.error("Password should not exceed 15 characters");
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
        setLoading(true); // Show the preloader
        const { email, password, rememberMe } = state;

        if (password.length < 5) {
            toast.error("Password should be at least 5 characters long");
            setLoading(false); // Hide the preloader if validation fails
            return;
        }

        fetch(`${apiUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Login failed");
                }
            })
            .then((data) => {
                const token = data.token;
                localStorage.setItem("Token", token);
                localStorage.setItem("UserId", data.user._id);
                localStorage.setItem("UserEmail", data.user.email);
                localStorage.setItem("UserData", data.user);

                // If "Remember Me" is checked, save credentials to local storage
                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                }

                setLoading(false); // Hide the preloader
                toast.success(
                    <div>
                        Logged in successfully.
                        <br />
                        Navigating to profile page in few seconds...
                    </div>,
                    {
                        autoClose: 2000,
                    }
                );

                setTimeout(() => {
                    navigate("/profile");
                }, 2000);
            })
            .catch((error) => {
                // Handle errors
                toast.error(`${error.message}: Invalid credentials. Please try again.`);
                console.error(error);
                setLoading(false); // Hide the preloader
            });
    };

    return (
        <div className="form-container sign-in-container">
            <ToastContainer
                position="top-left"
                autoClose={false}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
            />
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
                    <div className="flex space-x-2" style={{ transform: "translateX(-230%)" }}>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-600"></div>
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-800"></div>
                    </div>
                </div>
            )}
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
            </form>
        </div>
    );
}

export default SignInForm;
