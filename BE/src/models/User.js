import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    fullName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true } //createdAt, updatedAt
);
// last login date 

const User = mongoose.model("User", userSchema);

export default User;