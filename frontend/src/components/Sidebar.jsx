import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const studentNavItems = [
  "Overview",
  "Classes",
  "Assignments",
  "Grades",
  "Profile",
];
const adminNavItems = [
  "Overview",
  "Students",
  "Teachers",
  "Classes",
  "Reports",
  "Settings",
];

function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleLogout = async () => {
    navigate("/");
    await logout();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden relative flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600">
            <span className="text-xs font-bold text-white">CF</span>
          </div>
          <span className="text-base font-bold text-white">ClassFlow</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between border-r border-gray-800 bg-gray-900/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:z-auto md:translate-x-0 md:w-64 md:shrink-0 md:bg-gray-900/60`}
      >
        <div>
          <div className="flex items-center justify-between gap-3 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-950/50">
                <span className="text-sm font-bold text-white">CF</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-white">
                  ClassFlow
                </span>
                {isAdmin && (
                  <span className="block text-xs text-indigo-400 font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-3 pb-4 md:pb-6">
            {navItems.map((item, i) => (
              <button
                key={item}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-left transition ${
                  i === 0
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
