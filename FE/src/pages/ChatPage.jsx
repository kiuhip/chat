import { useAuthStore } from "../store/useAuthStore.js";
function ChatPage() {
  const { authUser, isLoading, login } = useAuthStore();
  return (
    <div>

    </div>
  )
}

export default ChatPage
