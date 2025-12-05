import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="pt-[52px] sm:pt-[59px] min-h-screen flex flex-col bg-neutral-primary">

      {/* Navbar */}
      <Navbar />

      {/* Page Outlet */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
