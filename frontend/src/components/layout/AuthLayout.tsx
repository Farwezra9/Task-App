import { Outlet, useLocation } from "react-router-dom";
import { ListTodo, CheckCircle, Sparkles } from "lucide-react";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans">
      {/* CSS Animasi Manual agar pasti jalan tanpa plugin */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-right { animation: slideInRight 0.5s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.5s ease-out forwards; }
      `}</style>

      {/* === SISI KIRI: VISUAL (Royal Blue) === */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2557bd] relative p-12 xl:p-20 flex-col justify-between text-white overflow-hidden">
        
        {/* Dekorasi Ornamen Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px]" />

        {/* Branding & Text */}
        <div className="relative z-20">
          <div className="flex items-center gap-2 font-light text-2xl tracking-tighter mb-12">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <ListTodo size={28} strokeWidth={1.5} />
            </div>
            <span className="font-normal tracking-tight">TaskFlow.</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl xl:text-6xl font-light leading-[1.1] mb-6 tracking-tight">
              Manage Tasks <br /> 
              <span className="font-normal text-blue-200">& To-Do Lists.</span>
            </h1>
            <p className="text-blue-100/70 text-lg font-light leading-relaxed max-w-sm">
              Atur semua tugas harian dan progres kerja kamu dalam satu tempat yang tersinkronisasi.
            </p>
          </div>
        </div>

        {/* === FLOATING CARDS SECTION === */}
        <div className="relative h-full w-full z-10 mt-8">
          
          {/* Card 1: Melayang di Kiri (Solid White) */}
          <div className="absolute top-10 left-0 bg-white p-6 rounded-[2rem] shadow-2xl w-64 transform -rotate-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <CheckCircle size={22} strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2 w-20 bg-slate-100 rounded-full" />
                <div className="h-1.5 w-12 bg-slate-50 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
               <div className="h-1.5 w-full bg-slate-50 rounded-full" />
               <div className="h-1.5 w-3/4 bg-slate-50 rounded-full" />
            </div>
          </div>

          {/* Card 2: Melayang di Kanan Bawah (Glassmorphism) */}
          <div className="absolute bottom-20 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] shadow-2xl w-64 transform rotate-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2 w-20 bg-white/20 rounded-full" />
                <div className="h-1.5 w-12 bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
               <div className="h-1.5 w-full bg-white/10 rounded-full" />
               <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Watermark Footer */}
        <div className="relative z-20 text-sm font-light text-blue-200/40">
          © 2026 TaskFlow Productivity Platform.
        </div>
      </div>

      {/* === SISI KANAN: FORM (Login/Register) === */}
      <div className="w-full lg:w-1/2 h-screen flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white overflow-hidden">
        {/* Container Utama dengan Animasi Geser berdasarkan Route */}
        <div 
          key={location.pathname} 
          className={`w-full max-w-md ${
            location.pathname === '/register' 
              ? 'animate-slide-right' 
              : 'animate-slide-left'
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;