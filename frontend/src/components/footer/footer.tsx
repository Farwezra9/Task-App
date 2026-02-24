import { Link } from "react-router-dom";
import { ListTodo, Github, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <ListTodo size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MyTask</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Platform produktivitas nomor satu untuk mengelola tugas harian dan daftar belanjaan dengan cerdas, cepat, dan aman.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-600 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-slate-500">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link></li>
              <li><Link to="/features" className="hover:text-blue-600 transition-colors">Fitur Utama</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Harga</Link></li>
              <li><Link to="/demo" className="hover:text-blue-600 transition-colors">Lihat Demo</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Bantuan</h4>
            <ul className="space-y-4 text-slate-500">
              <li><Link to="/faq" className="hover:text-blue-600 transition-colors">Pusat Bantuan (FAQ)</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Kantor Pusat</h4>
            <ul className="space-y-4 text-slate-500">
              <li className="flex gap-3">
                <MapPin className="text-blue-600 shrink-0" size={20} />
                <span>Digital Hub, BSD City, Tangerang, Indonesia</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-blue-600 shrink-0" size={20} />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-blue-600 shrink-0" size={20} />
                <span>hello@mytask.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; 2026 MyTask Productivity Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1">Dibuat dengan ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;