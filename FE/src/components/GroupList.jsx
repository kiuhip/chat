import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Plus, Users } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function GroupList() {
    const { getMyGroups, groups, isUsersLoading, setSelectedUser } = useChatStore();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        getMyGroups();
    }, [getMyGroups]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;

    return (
        <div className="space-y-4">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    My Groups
                </h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-xs btn-circle btn-ghost text-slate-400 hover:text-cyan-500 hover:bg-slate-800"
                    title="Create Group"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 opacity-50" />
                    <p>No groups yet.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-cyan-500 hover:underline"
                    >
                        Create one?
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {groups.map((group) => (
                        <div
                            key={group._id}
                            className="bg-cyan-500/10 p-3 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
                            onClick={() => setSelectedUser(group)}
                        >
                            <div className="avatar placeholder">
                                <div className="bg-slate-700 text-slate-200 rounded-full w-12 text-lg font-semibold uppercase">
                                    {group.avatar ? (
                                        <img src={group.avatar} alt={group.name} />
                                    ) : (
                                        <span>{group.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-slate-200 font-medium truncate">{group.name}</h4>
                                {group.lastMessage ? (
                                    <p className={`text-xs truncate ${!group.lastMessage.readBy.includes(useAuthStore.getState().authUser._id) ? "font-bold text-slate-100" : "text-slate-400"
                                        }`}>
                                        <span className="font-normal text-slate-500">{group.lastMessage.senderId.fullName}: </span>
                                        {group.lastMessage.image ? "Image" : group.lastMessage.text}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400 truncate">
                                        {group.members.length} members
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <CreateGroupModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
}

export default GroupList;
