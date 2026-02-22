import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  ListTodo, 
  ShieldCheck, 
  Zap, 
  Lock 
} from "lucide-react";
import Button from "../../components/ui/button/button";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Navbar sudah dihapus dari sini agar tidak double */}

      {/* --- HERO SECTION --- */}
      <header className="relative pt-16 pb-24 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-50">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-emerald-100 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <Zap size={16} fill="currentColor" />
            <span>Productivity Booster 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Kelola Belanjaan & Tugas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Tanpa Ribet.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Satu tempat untuk mengatur semua daftar tugas dan belanjaan kamu. 
            Lebih rapi, lebih cepat, dan tersinkronisasi di semua perangkat.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="gap-2 w-full sm:w-auto shadow-2xl">
                Gunakan Sekarang <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Lihat Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
            <Lock size={14} />
            <span>Akses penuh fitur To-Do memerlukan akun</span>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <FeatureItem 
            icon={<CheckCircle2 className="text-emerald-500" size={32} />}
            title="Sangat Cepat"
            desc="Didesain dengan React 19 untuk performa yang luar biasa responsif."
          />
          <FeatureItem 
            icon={<ShieldCheck className="text-blue-500" size={32} />}
            title="Data Aman"
            desc="Tugas dan catatan belanja kamu tersimpan aman di cloud pribadi."
          />
          <FeatureItem 
            icon={<ListTodo className="text-purple-500" size={32} />}
            title="Multi-Task"
            desc="Bisa membuat banyak kategori daftar untuk segala kebutuhanmu."
          />
        </div>
      </section>

      <footer className="py-10 text-center text-slate-400 text-sm">
        <p>&copy; 2026 MyToko. Dibuat dengan ❤️ untuk produktivitas maksimal.</p>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="mb-4 bg-slate-50 w-fit p-3 rounded-2xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export default LandingPage;