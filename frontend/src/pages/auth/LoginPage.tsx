import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { AlertCircle,Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import API from "../../api/api";
import Button from "../../components/ui/button/button";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("user", "true");

      navigate("/todos");
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
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
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors" size={18} strokeWidth={1.5} />
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
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors" size={18} strokeWidth={1.5} />
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

        <div className="pt-4">
          <Button 
            type="submit" 
          variant="royal"
          size="md"
          className="w-full py-4"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} strokeWidth={1.5} /> : "Login"}
          </Button>
        </div>

        <button 
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-xl font-light text-sm text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="google" />
          <span>Sign in with Google</span>
        </button>
      </form>

      <div className="mt-12 text-center text-sm font-light text-slate-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#2557bd] font-normal hover:underline ml-1">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;