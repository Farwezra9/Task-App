import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { AlertCircle, Mail, Lock, Loader2 } from "lucide-react";
import API from "../../api/api";
import Button from "../../components/ui/button/button";

function LoginPage() {
  const navigate = useNavigate();
  // Mengambil fungsi showAlert dari context layout
  const { showAlert }: any = useOutletContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const storage = rememberMe ? localStorage : sessionStorage;

      localStorage.clear();
      sessionStorage.clear();

      storage.setItem("token", res.data.token);
      storage.setItem("name", res.data.name);
      storage.setItem("email", res.data.email);

      // Memicu alert sukses di layout
      showAlert("Login Berhasil!", `Selamat datang kembali, ${res.data.name}`, "success");

      setTimeout(() => {
        navigate("/todos");
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Email atau password salah.";
      setError(errorMsg);
      // Memicu alert error di layout
      showAlert("Login Gagal", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password", {
      state: { email },
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-light tracking-tight text-slate-800 mb-3">
          Hello <span className="font-normal text-[#2557bd]">Again!</span>
        </h2>
        <p className="text-slate-800 font-light text-base leading-relaxed">
          Welcome back, ready to clear your tasks?
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-light">
            <AlertCircle size={18} strokeWidth={1.5} />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-normal text-slate-800 uppercase tracking-[0.2em] ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="email"
              placeholder="nama@example.com"
              className="w-full bg-slate-50 border border-transparent rounded-sm py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-normal text-slate-800 uppercase tracking-[0.2em] ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="password"
              placeholder="Masukkan Password"
              className="w-full bg-slate-50 border border-transparent rounded-sm py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center group cursor-pointer select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-[#2557bd] checked:border-[#2557bd] transition-all duration-200 cursor-pointer"
              />
              <svg
                className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="ml-2 text-slate-600 font-light group-hover:text-[#2557bd] transition-colors">
              Remember Me
            </span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#2557bd] font-medium hover:text-blue-800 transition-colors"
          >
            Lupa Password?
          </button>
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
              <Loader2
                className="animate-spin mx-auto"
                size={20}
                strokeWidth={1.5}
              />
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-12 text-center text-sm font-light text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#2557bd] font-normal hover:underline ml-1"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;