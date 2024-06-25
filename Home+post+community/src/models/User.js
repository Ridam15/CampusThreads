// user.mjs
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["student", "professor"],
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Profile",
    },
    community: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
        },
    ],
    profilePicture: {
        type: String,
    },
    token: {
        type: String,
    },
    reserPasswordExpires: {
        type: Date,
    },
    interestedTags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});

export default mongoose.model("User", userSchema);
