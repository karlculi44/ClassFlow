import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const stats = [
    { label: "Total Students", value: "1,248" },
    { label: "Total Teachers", value: "86" },
    { label: "Active Classes", value: "52" },
    { label: "Pending Approvals", value: "7" },
  ];

  const recentActivity = [
    { text: "New teacher account approved", time: "10 min ago" },
    { text: "Class schedule updated for Grade 10", time: "1 hr ago" },
    { text: "Student enrollment request submitted", time: "3 hrs ago" },
  ];

  const navItems = [
    "Overview",
    "Students",
    "Teachers",
    "Classes",
    "Reports",
    "Settings",
  ];

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambience background */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-800 bg-gray-900/60 backdrop-blur-sm md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-950/50">
                <span className="text-sm font-bold text-white">CF</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-white">
                  ClassFlow
                </span>
                <span className="block text-xs text-indigo-400 font-medium">
                  Admin
                </span>
              </div>
            </div>
            <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1 px-3 pb-4 md:pb-6">
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

        {/* Main content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage students, teachers, and classes across ClassFlow.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-gray-900 border border-gray-800 p-5 shadow-lg shadow-black/30"
              >
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-2 rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.text}
                    className="flex items-center justify-between rounded-xl bg-gray-800/60 border border-gray-800 px-4 py-3"
                  >
                    <p className="text-sm text-gray-100">{activity.text}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {["Add Student", "Add Teacher", "Create Class"].map(
                  (action) => (
                    <button
                      key={action}
                      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold py-2.5 transition"
                    >
                      {action}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
