import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === receiverId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
            status: { $in: ["pending", "accepted"] },
        });

        if (existingRequest) {
            if (existingRequest.status === "accepted") {
                return res.status(400).json({ message: "You are already friends" });
            }
            return res.status(400).json({ message: "Friend request already sent/pending" });
        }

        const newRequest = new FriendRequest({
            senderId,
            receiverId,
        });

        await newRequest.save();

        res.status(201).json(newRequest);
    } catch (error) {
        console.log("Error in sendFriendRequest controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (request.receiverId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request is already processed" });
        }

        request.status = "accepted";
        await request.save();

        await User.findByIdAndUpdate(request.senderId, { $push: { friends: request.receiverId } });
        await User.findByIdAndUpdate(request.receiverId, { $push: { friends: request.senderId } });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await FriendRequest.find({ receiverId: userId, status: "pending" })
            .populate("senderId", "fullName profilePic email");

        res.status(200).json(requests);
    } catch (error) {
        console.log("Error in getFriendRequests controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("friends", "fullName profilePic email");
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getFriends controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSuggestions = async (req, res) => {
    try {
        const userId = req.user._id;

        // precise logic: find users who are NOT me AND NOT in my friends list AND NOT in pending requests (either direction)

        // 1. Get current user's friends
        const currentUser = await User.findById(userId);
        const friendIds = currentUser.friends;

        // 2. Get pending request user IDs (both sent and received)
        const pendingRequests = await FriendRequest.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            status: "pending"
        });

        const pendingUserIds = pendingRequests.map(req =>
            req.senderId.toString() === userId.toString() ? req.receiverId : req.senderId
        );

        const excludeIds = [userId, ...friendIds, ...pendingUserIds];

        const suggestions = await User.find({ _id: { $nin: excludeIds } }).select("fullName profilePic email");

        res.status(200).json(suggestions);
    } catch (error) {
        console.log("Error in getSuggestions controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
