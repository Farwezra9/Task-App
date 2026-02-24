import { Outlet } from "react-router-dom";
import Navbar from "../header/navbar";
import Footer from "../footer/footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="w-full flex-1 pt-4 pb-8">
        {/* Konten full-width, tapi beri padding di mobile */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;