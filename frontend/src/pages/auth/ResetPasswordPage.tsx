import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, AlertCircle, Lock, ArrowLeft } from "lucide-react";
import API from "../../api/api";
import Button from "../../components/ui/button/button";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Password tidak sama");
    }

    setIsLoading(true);

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-light tracking-tight text-slate-800 mb-3">
          Buat <span className="font-normal text-[#2557bd]">Password Baru</span>
        </h2>
        <p className="text-slate-800 font-light text-base leading-relaxed">
          Masukkan password baru untuk akun Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-light">
            <AlertCircle size={18} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl text-sm font-light">
            {message}
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-normal text-slate-800 uppercase tracking-[0.2em] ml-1">
            Password Baru
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Masukkan password baru"
              className="w-full bg-slate-50 border border-transparent rounded-sm py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-normal text-slate-800 uppercase tracking-[0.2em] ml-1">
            Konfirmasi Password
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Ulangi password baru"
              className="w-full bg-slate-50 border border-transparent rounded-sm py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="royal"
            size="md"
            className="w-full py-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" size={20} strokeWidth={1.5} />
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#2557bd] transition"
        >
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>
      </form>
    </div>
  );
}

export default ResetPasswordPage;