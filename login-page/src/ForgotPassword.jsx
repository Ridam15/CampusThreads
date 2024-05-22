// ForgotPassword.js

import React, { useState } from 'react';
import './Forgotpassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic for handling the forgot password functionality here
        // For example, you might send a reset password email to the entered email address.
        // Display a success or error message accordingly.
        // Update the `message` state to show the appropriate message to the user.
        setMessage(`Password reset link sent to ${email}`);
    };

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
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
    );
};

export default ForgotPassword;
