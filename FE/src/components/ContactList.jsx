import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const {
    setSelectedUser,
    isUsersLoading,
    friends,
    friendRequests,
    suggestions,
    getFriends,
    getFriendRequests,
    getSuggestions,
    sendFriendRequest,
    acceptFriendRequest
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // getAllContacts(); // Deprecated in favor of split lists
    getFriends();
    getFriendRequests();
    getSuggestions();
  }, [getFriends, getFriendRequests, getSuggestions]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const filteredFriends = friends.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="input input-sm input-bordered w-full pl-10 bg-slate-800/50 text-slate-200 border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Friend Requests</h3>
          {friendRequests.map((request) => (
            <div key={request._id} className="bg-slate-800/30 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden">
                  <img src={request.senderId.profilePic || "/avatar.png"} alt={request.senderId.fullName} />
                </div>
                <div className="text-sm text-slate-200 font-medium">{request.senderId.fullName}</div>
              </div>
              <button
                onClick={() => acceptFriendRequest(request._id)}
                className="btn btn-xs btn-primary bg-cyan-600 hover:bg-cyan-700 border-none text-white"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Friends Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">My Friends</h3>
        {filteredFriends.length === 0 ? (
          <div className="text-sm text-slate-500 pl-1">No friends found</div>
        ) : (
          filteredFriends.map((contact) => (
            <div
              key={contact._id}
              className="bg-cyan-500/10 p-3 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
              onClick={() => setSelectedUser(contact)}
            >
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                <div className="size-10 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium text-sm">{contact.fullName}</h4>
            </div>
          ))
        )}
      </div>

      {/* Suggestions Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Suggested Contacts</h3>
        {filteredSuggestions.length === 0 ? (
          <div className="text-sm text-slate-500 pl-1">No suggestions available</div>
        ) : (
          filteredSuggestions.map((contact) => (
            <div key={contact._id} className="bg-slate-800/30 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full overflow-hidden">
                  <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                </div>
                <div className="text-sm text-slate-200 font-medium">{contact.fullName}</div>
              </div>
              <button
                onClick={() => sendFriendRequest(contact._id)}
                className="btn btn-xs btn-outline border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
export default ContactList;