import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

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

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambience background */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row">
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
