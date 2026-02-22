import { Outlet } from "react-router-dom";
import Navbar from "../header/navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="w-full flex-1 px-6 pt-4 pb-8">
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;