function AdminDashboard() {
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

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambience background */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row">
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
