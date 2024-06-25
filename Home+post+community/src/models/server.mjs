// server.mjs

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import User from './User.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/campus-connect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/api/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, accountType } = req.body;
        const newUser = new User({ firstName, lastName, email, password, accountType });
        await newUser.save();
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
