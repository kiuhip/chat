import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { BorderAnimatedContainer } from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);
  };
  
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* ... */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADER */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Chào mừng bạn</h2>
                  <p className="text-slate-400">Đăng nhập vào tài khoản của bạn</p>
                </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
             
                  {/* email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="abc@email.com"
                      />
                    </div>
                  </div>
                  {/* password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Nhập mật khẩu của bạn"
                      />
                    </div>
                  </div>
                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Đăng nhập"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Bạn chưa có tài khoản? Đăng ký
                  </Link>
                </div>
              </div>
            </div>
            { /* FORM */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Kết nối mọi người mọi lúc mọi nơi</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Miễn phí</span>
                    <span className="auth-badge">Dễ sử dụng</span>
                    <span className="auth-badge">Bảo mật</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default LoginPage
