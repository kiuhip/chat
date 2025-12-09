import Message from "../models/Message.js";
import User from "../models/User.js";
import Group from "../models/Group.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        // Check if userToChatId is a Group
        // We can check if it exists in Group collection? Or rely on a query param? or try/catch logic?
        // Simpler: Check if it's a group ID first. But IDs are just ObjectIds.
        // Convention: frontend should probably hit a different endpoint or we check both?
        // Actually, let's assume if it's not a User, it might be a Group. Or check both concurrently.

        let messages;
        const isGroup = await Group.exists({ _id: userToChatId });

        if (isGroup) {
            messages = await Message.find({ groupId: userToChatId }).populate("senderId", "fullName profilePic");
        } else {
            messages = await Message.find({
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId },
                ]
            });
        }

        // Mark messages as read by current user (if not already)
        // We can do this asynchronously or blocking. Blocking ensures UI gets updated state if we refetch.
        // Efficient way: updateMany.
        // "readBy" should NOT contain myId.

        // Find messages where I am not in readBy
        // const unreadMessages = messages.filter(msg => !msg.readBy.includes(myId)); // Inefficient loop if we just want to update DB

        await Message.updateMany(
            {
                _id: { $in: messages.map(m => m._id) },
                readBy: { $ne: myId }
            },
            { $addToSet: { readBy: myId } }
        );

        // IMPORTANT: The 'messages' array returned above still has old data. 
        // We should update it in memory or re-fetch. Re-fetching is safer but slower. 
        // Let's update in memory for response.
        messages.forEach(msg => {
            if (!msg.readBy.includes(myId)) {
                msg.readBy.push(myId);
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image, groupId } = req.body;
        const { id: receiverId } = req.params; // validation for single chat
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Cần phải nhập văn bản hoặc hình ảnh" });
        }


        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        let newMessage;
        if (groupId) {
            newMessage = new Message({
                senderId,
                groupId,
                text,
                image: imageUrl,
                readBy: [senderId],
            });
            await newMessage.save();

            // Emit to group room
            io.to(groupId).emit("newMessage", newMessage);

        } else {
            // Single chat logic
            if (senderId.equals(receiverId)) {
                return res.status(400).json({ message: "Bạn không thể gửi tin nhắn cho chính bạn" });
            }
            const receiverExists = await User.exists({ _id: receiverId });
            if (!receiverExists) {
                return res.status(404).json({ message: "Người nhận không tồn tại" });
            }

            newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
                readBy: [senderId],
            });
            await newMessage.save();

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId },
            ],
            groupId: undefined, // Only DMs
        });

        const chatPartnersId = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            )
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnersId } }).select("-password");

        // Enrich with lastMessage
        // This can be N+1 query problem if not careful, but for MVP/Recall it's okay.
        // Better: Aggregate. But let's stick to simple loops for now as per codebase style.

        const partnersWithLastMessage = await Promise.all(chatPartners.map(async (partner) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: partner._id },
                    { senderId: partner._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });

            return {
                ...partner.toObject(),
                lastMessage
            };
        }));

        // Sort by lastMessage createdAt?
        partnersWithLastMessage.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
            return dateB - dateA;
        });

        res.status(200).json(partnersWithLastMessage);
    } catch (error) {
        console.log("Error in getChatPartners controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

