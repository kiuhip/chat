import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, X, Lock } from "lucide-react";
import toast from "react-hot-toast";

const SettingsModal = ({ isOpen, onClose }) => {
    const { updatePassword } = useAuthStore();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (formData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setIsLoading(true);
        const success = await updatePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });
        setIsLoading(false);

        if (success) {
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            // Optional: don't close modal to let user see success, or close it.
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md relative shadow-2xl border border-slate-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="size-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    Settings
                </h2>

                <div className="space-y-6">
                    {/* Password Section */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Lock className="size-4" /> Change Password
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    className="input input-bordered w-full bg-slate-900 border-slate-600 focus:border-cyan-500 text-white pl-4"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    className="input input-bordered w-full bg-slate-900 border-slate-600 focus:border-cyan-500 text-white pl-4"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    className="input input-bordered w-full bg-slate-900 border-slate-600 focus:border-cyan-500 text-white pl-4"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full bg-cyan-600 hover:bg-cyan-700 border-none text-white"
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>

                    {/* Future Settings Placeholders */}
                    <div className="text-center text-xs text-slate-500">
                        More settings coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
