import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 md:flex-row">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="relative min-w-0 flex-1 pt-17.25 md:ml-64 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
