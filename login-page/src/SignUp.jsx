import React, { useState } from "react";
import img from "./img.jpg";
import { Link, useNavigate } from "react-router-dom";
import RadioButton from "./RadioButton";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
// import "./styles.css"; // Import your custom CSS file

function SignUpForm() {
    const navigate = useNavigate();
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "", // New field for confirm password
    });

    const [value, setValue] = useState("Student");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (evt) => {
        const value = evt.target.value;
        const name = evt.target.name;

        if (name === "firstName" || name === "lastName") {
            // Check if the input contains only alphabetic characters
            if (!/^[a-zA-Z]*$/.test(value)) {
                alert(`${name === "firstName" ? "First" : "Last"} name should contain only alphabetic characters`);
                return;
            }

            // Check if the first name or last name length exceeds 15 characters
            if (value.length > 15) {
                // If it does, truncate it to the first 15 characters
                setState({
                    ...state,
                    [name]: value.slice(0, 15),
                });
                alert(`${name === "firstName" ? "First" : "Last"} name should not exceed 15 characters`);
            } else {
                setState({
                    ...state,
                    [name]: value,
                });
            }
        } else if (name === "email") {
            // Check if the email length exceeds 30 characters
            if (value.length > 35) {
                // If it does, truncate it to the first 30 characters
                setState({
                    ...state,
                    [name]: value.slice(0, 35),
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

    const handleOnSubmit = async (evt) => {
        evt.preventDefault();

        const { firstName, lastName, email, password, confirmPassword } = state;

        // Basic required field validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        // Password and confirmPassword match validation
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const signupData = {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType: value,
        };
        localStorage.setItem('signupData', JSON.stringify(signupData));
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/sendotp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    accountType: value,
                }),
            });

            const result = await response.json();

            if (result.success) {
                console.log(result);
                alert("OTP has been sent to your email");
                // Optionally, redirect the user or perform other actions.
                setFormSubmitted(true);
                navigate("/OTP"); // Navigate to OTP page
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Internal server error");
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <div className="logo">
                    <p>
                        <img src={img} alt=" " /> CampusThreads
                    </p>
                </div>
                <h1>Create Account</h1>
                <div id="fullname">
                    <input
                        type="text"
                        name="firstName"
                        className="i1"
                        value={state.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        className="i2"
                        value={state.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                    className="custom-input" // Apply custom CSS class
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={state.confirmPassword}
                    onChange={handleChange}
                    className="custom-input" // Apply custom CSS class
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <RadioButton value={value} handleChange={(evt) => setValue(evt.target.value)} />
                {isFormSubmitted ? (
                    <Link to="/OTP" style={{ textDecoration: 'none' }}>
                        <button type="submit">Sign Up</button>
                    </Link>
                ) : (
                    <button type="submit">Sign Up</button>
                )}
                {/* <div className="alt-s">
                    <span>OR</span>
                </div>
                <div className="social-container">
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

export default SignUpForm;
