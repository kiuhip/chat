import { useAuthStore } from "../store/useAuthStore.js";
function LoginPage() {
  const { authUser, isLoading, login } = useAuthStore();
  return (
    <div>

    </div>
  )
}

export default LoginPage
