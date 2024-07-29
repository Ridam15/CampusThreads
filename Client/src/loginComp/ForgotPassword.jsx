// ForgotPassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgotpassword.css';

const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
    const Navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add your logic for handling the forgot password functionality here
        // For example, you might send a reset password email to the entered email address.
        // Display a success or error message accordingly.
        // Update the message state to show the appropriate message to the user.
        try {
            const response = await fetch(`${apiUrl}/api/v1/auth/reset-password-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const result = await response.json();
            // console.log(result);
            if (result.success) {
                // setMessage("Link to reset Your Password has been sent to your email");
                const userConfirmed = window.confirm("Link to reset Your Password has been sent to your email!!");
                if (userConfirmed) {
                    // Optionally, you can reset the email state here
                    setEmail('');
                    // Navigate to OTP page
                    Navigate("../");
                }
            } else {
                setMessage(`${result.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Internal server error");
        }
        // setMessage(Password reset link sent to ${email});
    };

    return (
        // <div className='body3'>
        <div className="forgot-password-container ">
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h2>Forgot Password?</h2>
                <label htmlFor="email">Enter Registered Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
        // </div >
    );
};

export default ForgotPassword;