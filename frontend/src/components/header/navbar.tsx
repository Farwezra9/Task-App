import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListTodo, User, LogOut, ChevronDown } from "lucide-react";
import Button from "../ui/button/button";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const name =
      localStorage.getItem("name") ||
      sessionStorage.getItem("name");

    setIsLoggedIn(!!token);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserName(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-2xl tracking-tighter text-blue-600 transition hover:opacity-80"
        >
          <ListTodo size={32} strokeWidth={2.5} />
          <span>MyTask</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </div>
          ) : (
            <div
              className="relative py-2"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-2 p-1.5 pr-3 transition-all">
                <div className="bg-blue-600 p-1.5 rounded-full text-white">
                  <User size={18} />
                </div>

                <span className="text-sm font-semibold text-slate-700 hidden md:block">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-52 bg-white border border-slate-100 rounded-sm shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/todos"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <ListTodo size={18} /> My Tasks
                  </Link>

                  <div className="h-px bg-slate-50 my-1 mx-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;