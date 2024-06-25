// ResetPassword.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css'; // Use the new stylesheet

const ResetPassword = () => {
    const Navigate = useNavigate();
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setnewConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Use the 'token' value as needed
        console.log("Token from URL:", token);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert("Password should start with a capital letter and include a special character");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + token,
                },
                body: JSON.stringify({
                    newPassword,
                    token,
                    newConfirmPassword,
                }),
            });
            const result = await response.json();
            console.log(result);

            if (result.success) {
                setMessage("Password reset successfully");
                const userConfirmed = window.confirm("Password reset successfully. Click 'OK' to proceed to login");
                if (userConfirmed) {
                    // Optionally, you can reset the state here
                    setNewPassword('');
                    setnewConfirmPassword('');
                    // Navigate to OTP page
                    Navigate("../");
                }
            } else {
                setMessage(`${result.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle the error
        }
    };

    return (
        <div className='body3'>
            <div className="reset-password-container">
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <h2>Reset Your Password</h2>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={newConfirmPassword}
                        onChange={(e) => setnewConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                    {message && <p className="reset-message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
