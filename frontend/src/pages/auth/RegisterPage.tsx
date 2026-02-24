import { useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import API from "../../api/api";
import Button from "../../components/ui/button/button";

function RegisterPage() {
  const navigate = useNavigate();
  // Mengambil fungsi showAlert dari context layout
  const { showAlert }: any = useOutletContext();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/register", { name, email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("user", "true");

      // Memicu alert sukses yang ada di AuthLayout
      showAlert("Registrasi Berhasil!", "Akun Anda telah dibuat. Mengalihkan...", "success");
      
      setTimeout(() => {
        navigate("/todos");
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registrasi gagal.";
      setError(msg);
      // Memicu alert error yang ada di AuthLayout
      showAlert("Registrasi Gagal", msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-light tracking-tight text-slate-800 mb-3">
          Join <span className="font-normal text-[#2557bd]">TaskFlow.</span>
        </h2>
        <p className="text-slate-800 font-light text-base leading-relaxed">
          Mulai atur tugasmu dengan lebih rapi dan terukur.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-light animate-in zoom-in-95">
            <AlertCircle size={18} strokeWidth={1.5} />
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-[10px] font-normal text-slate-800 uppercase tracking-[0.2em] ml-1">
            Nama
          </label>
          <div className="relative group">
            <User 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2557bd] transition-colors" 
              size={18} 
              strokeWidth={1.5} 
            />
            <input
              type="text"
              placeholder="Masukkan Nama"
              className="w-full bg-slate-50 border border-transparent rounded-sm py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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
              className="w-full bg-slate-50 border border-transparent rounded-xl py-4 pl-12 pr-5 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all font-light text-slate-600 placeholder:text-slate-500"
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
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" size={20} strokeWidth={1.5} />
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-12 text-center text-sm font-light text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-[#2557bd] font-normal hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;