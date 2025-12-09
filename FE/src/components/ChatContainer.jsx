import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
              const isMe = senderId === authUser._id;
              const isGroup = selectedUser.members !== undefined;

              let senderName = null;
              if (isGroup && !isMe) {
                if (msg.senderId?.fullName) {
                  senderName = msg.senderId.fullName;
                } else {
                  const member = selectedUser.members.find(m => m._id === senderId);
                  senderName = member?.fullName || "Unknown";
                }
              }

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                >
                  {senderName && (
                    <div className="chat-header mb-1 text-xs opacity-70 ml-1">
                      {senderName}
                    </div>
                  )}
                  <div
                    className={`chat-bubble relative ${isMe
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                      }`}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                    )}
                    {msg.text && <p className="mt-2">{msg.text}</p>}
                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName || ""} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;