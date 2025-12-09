import Group from "../models/Group.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const senderId = req.user._id;

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ message: "Name and members are required" });
        }

        // Validate that members are friends of the creator? 
        // User requested: "chỉ thêm được những người là bạn của mình"
        const currentUser = await User.findById(senderId);
        const validMembers = members.filter(memberId => currentUser.friends.includes(memberId));

        if (validMembers.length !== members.length) {
            return res.status(400).json({ message: "You can only add friends to a group" });
        }

        // Add creator to members
        const finalMembers = [...validMembers, senderId];

        const newGroup = new Group({
            name,
            members: finalMembers,
            admin: senderId,
        });

        await newGroup.save();

        res.status(201).json(newGroup);
    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId }).populate("members", "-password");

        const groupsWithLastMessage = await Promise.all(groups.map(async (group) => {
            const lastMessage = await Message.findOne({ groupId: group._id }).sort({ createdAt: -1 });
            return {
                ...group.toObject(),
                lastMessage
            };
        }));

        // Sort by lastMessage
        groupsWithLastMessage.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
            return dateB - dateA;
        });

        res.status(200).json(groupsWithLastMessage);
    } catch (error) {
        console.log("Error in getMyGroups controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberId } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // User requested: "trong group chat thì tất cả mọi người đều có khả năng thêm, xoá thành viên"
        if (!group.members.includes(userId)) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        if (group.members.includes(memberId)) {
            return res.status(400).json({ message: "User is already in the group" });
        }

        // Validate "chỉ thêm được những người là bạn của mình" - Wait, if A adds B, does B have to be friends with A? Yes.
        const currentUser = await User.findById(userId);
        if (!currentUser.friends.includes(memberId)) {
            return res.status(400).json({ message: "You can only add your friends" });
        }

        group.members.push(memberId);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in addMember controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberId } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (!group.members.includes(userId)) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        // User requested: "tất cả mọi người đều có khả năng thêm, xoá thành viên"

        group.members = group.members.filter(id => id.toString() !== memberId);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in removeMember controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
