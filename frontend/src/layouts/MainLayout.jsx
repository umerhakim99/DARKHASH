import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;