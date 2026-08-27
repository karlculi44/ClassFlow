import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { logout, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
    await logout();
  };

  const stats = [
    { label: "Enrolled Classes", value: "6" },
    { label: "Assignments Due", value: "3" },
    { label: "Attendance Rate", value: "94%" },
    { label: "Upcoming Exams", value: "2" },
  ];

  const upcomingClasses = [
    { subject: "Mathematics", time: "9:00 AM", room: "Room 204" },
    { subject: "Physics", time: "11:00 AM", room: "Room 118" },
    { subject: "English Literature", time: "1:30 PM", room: "Room 305" },
  ];

  const navItems = ["Overview", "Classes", "Assignments", "Grades", "Profile"];

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambience background */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-800 bg-gray-900/60 backdrop-blur-sm md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-950/50">
                <span className="text-sm font-bold text-white">CF</span>
              </div>
              <span className="text-lg font-bold text-white">ClassFlow</span>
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
              Welcome back, {user?.name || "Student"}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Here&apos;s what&apos;s happening with your classes today.
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
            {/* Upcoming classes */}
            <div className="lg:col-span-2 rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white mb-4">
                Today&apos;s Schedule
              </h2>
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.subject}
                    className="flex items-center justify-between rounded-xl bg-gray-800/60 border border-gray-800 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-100">
                        {cls.subject}
                      </p>
                      <p className="text-xs text-gray-400">{cls.room}</p>
                    </div>
                    <span className="text-sm font-medium text-indigo-400">
                      {cls.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder panel */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-lg shadow-black/30">
              <h2 className="text-lg font-semibold text-white mb-4">
                Announcements
              </h2>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="rounded-xl bg-gray-800/60 border border-gray-800 px-4 py-3">
                  Placeholder announcement content goes here.
                </p>
                <p className="rounded-xl bg-gray-800/60 border border-gray-800 px-4 py-3">
                  Placeholder announcement content goes here.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
