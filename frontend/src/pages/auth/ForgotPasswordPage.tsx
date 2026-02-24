import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import API from "../../api/api";
import Button from "../../components/ui/button/button";

function ForgotPasswordPage() {
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // ambil email dari state atau localStorage
  useEffect(() => {
    const stateEmail = location.state?.email;

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("forgot_email", stateEmail);
    } else {
      const savedEmail = localStorage.getItem("forgot_email");
      if (savedEmail) setEmail(savedEmail);
    }

    // cek expiry timer saat refresh
    const savedExpiry = localStorage.getItem("reset_expiry");
    if (savedExpiry) {
      const remaining = Math.floor(
        (Number(savedExpiry) - Date.now()) / 1000
      );

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem("reset_expiry");
      }
    }
  }, [location.state]);

  // countdown berjalan tiap detik
  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("reset_expiry");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });

      setMessage(res.data.message);

      const expiryTime = Date.now() + 60 * 1000;
        localStorage.setItem("reset_expiry", expiryTime.toString());
        setTimeLeft(60);

      localStorage.removeItem("forgot_email");
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
          Reset <span className="font-normal text-[#2557bd]">Password</span>
        </h2>
        <p className="text-slate-800 font-light text-base leading-relaxed">
          Masukkan email untuk menerima link reset password.
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

        <div className="pt-4">
          <Button
            type="submit"
            variant="royal"
            size="md"
            className="w-full py-4"
            disabled={isLoading || timeLeft !== null}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" size={20} strokeWidth={1.5} />
            ) : (
              "Kirim Link Reset"
            )}
          </Button>
        </div>

        {timeLeft !== null && (
          <p className="text-sm text-slate-500 text-center">
            Kirim ulang dalam {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        )}

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

export default ForgotPasswordPage;