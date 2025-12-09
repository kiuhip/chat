import { useChatStore } from "../store/useChatStore";

import { BorderAnimatedContainer } from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import GroupList from "../components/GroupList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SettingsModal from "../components/SettingsModal";
import { Settings } from "lucide-react";
import { useState } from "react";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" && <ChatsList />}
            {activeTab === "contacts" && <ContactList />}
            {activeTab === "groups" && <GroupList />}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors w-full p-2 rounded-lg hover:bg-slate-800"
            >
              <Settings className="size-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* SETTINGS MODAL */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;