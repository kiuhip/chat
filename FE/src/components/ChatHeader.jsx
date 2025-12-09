import { XIcon, Info } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import GroupInfoModal from "./GroupInfoModal";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

  // Need to distinguish Group vs User
  const isGroup = selectedUser?.members !== undefined;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${!isGroup && (isOnline ? "online" : "offline")}`}>
          <div className="w-12 rounded-full">
            {isGroup ? (
              <div className="bg-slate-700 text-slate-200 rounded-full w-full h-full flex items-center justify-center text-lg font-semibold uppercase">
                {selectedUser?.avatar ? <img src={selectedUser.avatar} /> : selectedUser?.name?.charAt(0)}
              </div>
            ) : (
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName || ""} />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{isGroup ? selectedUser?.name : selectedUser?.fullName}</h3>
          <p className="text-slate-400 text-sm">
            {isGroup ? `${selectedUser?.members?.length} members` : (isOnline ? "Online" : "Offline")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isGroup && (
          <button onClick={() => setShowGroupInfo(true)} className="p-2 hover:bg-slate-700 rounded-full">
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        )}
        <button onClick={() => setSelectedUser(null)}>
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
      </div>

      {showGroupInfo && <GroupInfoModal onClose={() => setShowGroupInfo(false)} />}
    </div>
  );
}
export default ChatHeader;
