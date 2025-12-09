import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  carts: [],
  messages: [],
  friends: [],
  friendRequests: [],
  suggestions: [], // suggested contacts
  groups: [],
  activeTab: "chats",
  selectedUser: null, // This can be User or Group object
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => {
    set({ selectedUser, messages: [] }); // Reset messages when selecting new user
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/friends/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getSuggestions: async () => {
    try {
      const res = await axiosInstance.get("/friends/suggestions");
      set({ suggestions: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/friends/request/${userId}`);
      toast.success("Friend request sent");
      // Update suggestions to remove the user or mark as pending
      // For now, let's just refresh suggestions
      get().getSuggestions();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/accept/${requestId}`);
      toast.success("Friend request accepted");
      // Refresh requests and friends
      get().getFriendRequests();
      get().getFriends();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Duplicate acceptFriendRequest removed from here as it was already defined earlier or I added it twice.
  // Wait, I see I added it in Step 246 but it might have existed before? 
  // Let's check the file content if needed, but error says duplicate key.
  // I will just remove this block if it is indeed duplicate.
  // Checking line 108 in error: "Duplicate key 'acceptFriendRequest'".
  // So I'll remove the one I added or the previous one. I'll remove the one at line 103-113 range if it conflicts.
  // Actually, I'll view the file first to be sure where the duplicate is.
  // Better yet, I'll assume the one I added in previous turn caused duplication if I didn't check standard. 
  // I will just remove the SECOND occurrence if I can find it, or the first. 
  // Error 108 says it's there. 
  // Let's remove the function definition block around line 103.

  createGroup: async (groupData) => {
    try {
      await axiosInstance.post("/groups/create", groupData);
      toast.success("Group created successfully");
      get().getMyGroups();
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  },

  getMyGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Removed duplicate addMemberToGroup


  // Actually, let's fix the above logic to be cleaner
  addMember: async (groupId, memberId) => {
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/add`, { memberId });
      toast.success("Member added");
      set({ selectedUser: res.data });
      get().getMyGroups();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeMember: async (groupId, memberId) => {
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/remove`, { memberId });
      toast.success("Member removed");
      set({ selectedUser: res.data });
      get().getMyGroups();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // Update local chats/groups to mark as read
      const { chats, groups } = get();
      const myId = useAuthStore.getState().authUser._id;

      // Check if it's a group or DM
      const isGroup = chats.find(c => c._id === userId) === undefined; // Simple check if not in chats list (or use other logic)

      if (!isGroup) {
        const updatedChats = chats.map(chat => {
          if (chat._id === userId && chat.lastMessage && !chat.lastMessage.readBy.includes(myId)) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                readBy: [...chat.lastMessage.readBy, myId]
              }
            };
          }
          return chat;
        });
        set({ chats: updatedChats });
      } else {
        const updatedGroups = groups.map(group => {
          if (group._id === userId && group.lastMessage && !group.lastMessage.readBy.includes(myId)) {
            return {
              ...group,
              lastMessage: {
                ...group.lastMessage,
                readBy: [...group.lastMessage.readBy, myId]
              }
            };
          }
          return group;
        });
        set({ groups: updatedGroups });
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      // Check if selectedUser is a group (has 'members' or 'admin' or purely logic check)
      // Or check if it has email? Groups don't have email usually. 
      // Better: pass a flag or check property. 
      // Or check if it has email? Groups don't have email usually.
      // Better: pass a flag or check property.
      // Existing User model has email. Group model has members.
      const isGroup = !!selectedUser.members;

      const payload = { ...messageData };
      if (isGroup) {
        payload.groupId = selectedUser._id;
      }

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.connected) {
      console.log("Socket not connected, waiting...");
      // Wait for socket to connect
      const checkSocket = setInterval(() => {
        const currentSocket = useAuthStore.getState().socket;
        if (currentSocket && currentSocket.connected) {
          clearInterval(checkSocket);
          get().subscribeToMessages(); // Retry subscribe
        }
      }, 100);
      setTimeout(() => clearInterval(checkSocket), 5000); // Timeout after 5s
      return;
    }

    // Remove old listener first to avoid duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelectedUser, isSoundEnabled: currentSoundEnabled } = get();
      if (!currentSelectedUser) return;

      // Convert to string for comparison
      const senderId = newMessage.senderId?.toString();
      const selectedUserId = currentSelectedUser._id?.toString();
      const groupId = newMessage.groupId?.toString();

      // 1. Calculate if message is for current chat
      let isMessageForCurrentChat = false;
      if (currentSelectedUser?.members) {
        isMessageForCurrentChat = groupId === selectedUserId;
      } else if (currentSelectedUser) {
        isMessageForCurrentChat = senderId === selectedUserId;
      }

      // 2. Update Messages state (only if active)
      if (isMessageForCurrentChat) {
        set({ messages: [...get().messages, newMessage] });
      }

      // 3. Update Sidebar (Chats & Groups) - Last Message & Unread
      const { chats, groups } = get();
      const myId = useAuthStore.getState().authUser._id;

      // Helper to check if I am explicitly mentioned
      const myName = useAuthStore.getState().authUser.fullName;
      const isMentioned = newMessage.text?.includes(`@${myName}`);
      const isAllMentioned = newMessage.text?.includes("@All");

      if (groupId) {
        const updatedGroups = groups.map(group => {
          if (group._id === groupId) {
            // If not current chat, add to unread logic (if we tracked count, but here we track readBy)
            // If I am NOT the sender, and I am NOT in current chat, myId is NOT in readBy (default from BE is [senderId])
            // ensure lastMessage.readBy does not have myId if I am not viewing it.
            // BE sets readBy: [senderId]. 
            // If isMessageForCurrentChat, we should probably mark it read? 
            // For now, let's just display what BE sent. Unread status is derived from readBy.
            return { ...group, lastMessage: newMessage };
          }
          return group;
        });
        updatedGroups.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
        set({ groups: updatedGroups });
      } else {
        const updatedChats = chats.map(chat => {
          if (chat._id === senderId || chat._id === newMessage.receiverId) {
            return { ...chat, lastMessage: newMessage };
          }
          return chat;
        });
        updatedChats.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
        set({ chats: updatedChats });
      }

      // 4. Notifications & Sound
      // Don't notify if I sent it (shouldn't happen via socket usually but safety check)
      if (senderId === myId) return;

      if (currentSoundEnabled) {
        // Play sound
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }

      // Toast Notifications (only if NOT in current chat OR if it's a mention)
      // User requested notifications for "each message" and "mentions".
      // If active, usually no toast for normal messages.
      if (!isMessageForCurrentChat) {
        // Find sender name
        let senderName = "Someone";
        if (groupId) {
          const group = groups.find(g => g._id === groupId);
          const sender = group?.members?.find(m => m._id === senderId);
          senderName = sender?.fullName || "Group Member";
          if (group) senderName = `${senderName} in ${group.name}`;
        } else {
          const chat = chats.find(c => c._id === senderId);
          senderName = chat?.fullName || "Someone";
        }

        if (isAllMentioned) {
          toast(`📢 Everyone mentioned by ${senderName}: ${newMessage.text}`, { icon: '🔔' });
        } else if (isMentioned) {
          toast(`🔴 You were mentioned by ${senderName}: ${newMessage.text}`, { icon: '👋' });
        } else {
          toast(`${senderName}: ${newMessage.text}`, { icon: '💬' });
        }
      } else {
        // Even if active, if mentioned, maybe show a distinct toast? 
        // Use nice toast if mentioned
        if (isAllMentioned) {
          toast(`📢 @All mentioned: ${newMessage.text}`, { icon: '🔔' });
        } else if (isMentioned) {
          toast(`🔴 You were mentioned: ${newMessage.text}`, { icon: '👋' });
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));