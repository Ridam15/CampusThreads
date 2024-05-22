// OTPPage.js

import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './OTP.css';

const OTPPage = () => {
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        // Fetch signup data from localStorage
        const storedSignupData = localStorage.getItem('signupData');
        if (storedSignupData) {
            // Parse the JSON data and do something with it if needed
            const signupData = JSON.parse(storedSignupData);
            console.log('Signup Data:', signupData);
        }
    }, []);
    const handleChange = (index, value) => {
        // Allow removing the entered number
        if (value === '') {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);
        }

        // Validate that the entered value is a single digit
        else if (/^[0-9]$/.test(value)) {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);

            // Move to the next input field
            if (index < inputRefs.current.length - 1 && value !== '') {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleBackspace = (index, value) => {
        // Move to the previous input field when backspace is pressed on an empty field
        if (index > 0 && value === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOTP = otp.join('');

        // Fetch signup data from localStorage
        const storedSignupData = localStorage.getItem('signupData');

        if (!storedSignupData) {
            setMessage('Signup data not found. Please go back and fill out the signup form.');
            return;
        }

        try {
            const signupData = JSON.parse(storedSignupData);

            // Add your logic for handling the OTP verification functionality here
            // For example, you might verify the entered OTP against the expected OTP.
            // Display a success or error message accordingly.
            // Update the `message` state to show the appropriate message to the user.

            // Include OTP in the signup data
            signupData.otp = enteredOTP;

            // After OTP verification, you can send the signup data (including OTP) to the signup API
            const response = await fetch('https://campusconnectbackend.onrender.com/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            const result = await response.json();

            if (result.success) {
                setMessage('Signup successful');
                // Redirect or perform other actions
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Error verifying OTP or signing up');
            console.error('Error:', error);
        }
    };


    return (
        <div className="otp-page-container">
            <form className="otp-page-form" onSubmit={handleSubmit}>
                <h2>Enter OTP</h2>
                <div className="otp-input-fields">
                    {otp.map((value, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Backspace' && handleBackspace(index, value)
                            }
                            maxLength="1"
                            required
                            size="small" // Set size to small
                            margin="normal" // Add some margin
                        />
                    ))}
                </div>
                <Button variant="contained" type="submit">
                    Verify OTP
                </Button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default OTPPage;
