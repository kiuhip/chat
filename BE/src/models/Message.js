import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Optional if it's a group message
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: false,
        },
        text: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        image: {
            type: String,
        },
        readBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;