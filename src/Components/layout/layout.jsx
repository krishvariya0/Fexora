import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-primary">

      {/* Navbar */}
      <Navbar />

      {/* Page Outlet */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      

    </div>
  );
};

export default MainLayout;
