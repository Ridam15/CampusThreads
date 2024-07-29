import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './OTP.css';

const apiUrl = import.meta.env.VITE_API_URL;

const OTPPage = () => {
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedSignupData = localStorage.getItem('signupData');
        if (storedSignupData) {
            const signupData = JSON.parse(storedSignupData);
            console.log('Signup Data:', signupData);
        }
    }, []);

    const handleChange = (index, value) => {
        if (value === '') {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);
        } else if (/^[0-9]$/.test(value)) {
            const newOTP = [...otp];
            newOTP[index] = value;
            setOTP(newOTP);
            if (index < inputRefs.current.length - 1 && value !== '') {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleBackspace = (index, value) => {
        if (index > 0 && value === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOTP = otp.join('');
        const storedSignupData = localStorage.getItem('signupData');

        if (!storedSignupData) {
            setMessage('Signup data not found. Please go back and fill out the signup form.');
            return;
        }

        try {
            const signupData = JSON.parse(storedSignupData);
            signupData.otp = enteredOTP;

            const response = await fetch(`${apiUrl}/api/v1/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            const result = await response.json();

            if (result.success) {
                setMessage('Signup successful');
                setOpen(true); // Open the dialog on success
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Error verifying OTP or signing up');
            console.error('Error:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        navigate("../"); // Redirect to login page after closing the dialog
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
                            size="small"
                            margin="normal"
                        />
                    ))}
                </div>
                <Button variant="contained" type="submit">
                    Verify OTP
                </Button>
                {message && <p className="message">{message}</p>}
            </form>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your registration is successful. Click Yes to log in.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OTPPage;
