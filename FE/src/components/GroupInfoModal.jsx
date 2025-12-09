import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Plus, X, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function GroupInfoModal({ onClose }) {
    const { selectedUser, friends, addMember, removeMember } = useChatStore();
    const { authUser } = useAuthStore();
    const [showAddMember, setShowAddMember] = useState(false);

    // Group is `selectedUser` in this context
    const group = selectedUser;

    if (!group || !group.members) return null;

    const handleAddMember = async (userId) => {
        await addMember(group._id, userId);
        // Modal stays open, store should update
    };

    const handleRemoveMember = async (memberId) => {
        if (confirm("Are you sure you want to remove this member?")) {
            await removeMember(group._id, memberId);
        }
    };

    // Filter friends not in group
    const availableFriends = friends.filter(friend =>
        !group.members.some(member => member._id === friend._id)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden relative shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-slate-700 text-slate-200 rounded-full w-10 text-lg font-semibold uppercase">
                                {group.avatar ? (
                                    <img src={group.avatar} alt={group.name} />
                                ) : (
                                    <span>{group.name?.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{group.name}</h2>
                            <p className="text-xs text-slate-400">{group.members.length} members</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Members List */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-slate-400">Members</h3>
                            <button
                                onClick={() => setShowAddMember(!showAddMember)}
                                className="btn btn-xs btn-ghost text-cyan-500 hover:bg-slate-800"
                            >
                                {showAddMember ? "Cancel" : <><Plus className="w-3 h-3" /> Add Member</>}
                            </button>
                        </div>

                        {showAddMember && (
                            <div className="mb-4 bg-slate-800/20 p-2 rounded-lg border border-slate-700">
                                <p className="text-xs text-slate-500 mb-2">Select a friend to add:</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {availableFriends.length === 0 ? (
                                        <p className="text-slate-500 text-xs text-center py-2">No friends available to add.</p>
                                    ) : (
                                        availableFriends.map(friend => (
                                            <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded cursor-pointer" onClick={() => handleAddMember(friend._id)}>
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full overflow-hidden">
                                                        <img src={friend.profilePic || "/avatar.png"} className="object-cover w-full h-full" />
                                                    </div>
                                                    <span className="text-sm text-slate-200">{friend.fullName}</span>
                                                </div>
                                                <Plus className="w-4 h-4 text-slate-400" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {group.members.map(member => (
                                <div key={member._id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full overflow-hidden">
                                            <img src={member.profilePic || "/avatar.png"} alt={member.fullName} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-200">
                                                {member.fullName}
                                                {member._id === authUser._id && " (You)"}
                                                {member._id === group.admin && " (Admin)"}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Allow remove if authorized. Logic: Everyone can remove? User requested "tất cả mọi người đều có khả năng thêm, xoá thành viên" */}
                                    <button
                                        onClick={() => handleRemoveMember(member._id)}
                                        className="text-slate-500 hover:text-red-500 p-1"
                                        title="Remove member"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupInfoModal;
