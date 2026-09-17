import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import PageSkeleton from "../components/ui/PageSkeleton";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <main
        className="min-h-screen bg-gray-950 p-6 sm:p-8"
        role="status"
        aria-label="Loading page"
      >
        <PageSkeleton variant="dashboard" />
      </main>
    );
  }

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
