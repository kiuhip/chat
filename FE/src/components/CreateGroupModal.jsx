import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Users } from "lucide-react";
import toast from "react-hot-toast";

function CreateGroupModal({ onClose }) {
    const { friends, createGroup } = useChatStore();
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleToggleMember = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter((id) => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return toast.error("Group name is required");
        if (selectedMembers.length === 0) return toast.error("Select at least one friend");

        const success = await createGroup({
            name: groupName,
            members: selectedMembers,
        });

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden relative shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/30">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-500" />
                        Create Group Chat
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Group Name
                        </label>
                        <input
                            type="text"
                            className="input input-sm input-bordered w-full bg-slate-800/50 text-slate-200 border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
                            placeholder="e.g. Project Team"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Select Friends ({selectedMembers.length})
                        </label>
                        <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-700 rounded-lg p-2 bg-slate-800/20">
                            {friends.length === 0 ? (
                                <div className="text-slate-500 text-center text-sm py-4">
                                    No friends found. Add friends first!
                                </div>
                            ) : (
                                friends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => handleToggleMember(friend._id)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedMembers.includes(friend._id)
                                                ? "bg-cyan-500/20 border border-cyan-500/30"
                                                : "hover:bg-slate-700/30"
                                            }`}
                                    >
                                        <div className="size-8 rounded-full overflow-hidden shrink-0">
                                            <img
                                                src={friend.profilePic || "/avatar.png"}
                                                alt={friend.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-200 truncate">
                                                {friend.fullName}
                                            </h4>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(friend._id)}
                                            onChange={() => { }}
                                            className="checkbox checkbox-xs checkbox-primary border-slate-600"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/30 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-ghost text-slate-400 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        className="btn btn-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-none hover:from-cyan-600 hover:to-cyan-700"
                        disabled={!groupName.trim() || selectedMembers.length === 0}
                    >
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupModal;
