import { useContext, useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileCheck2,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getStudentEnrollments } from "../services/enrollmentServices";
import { getAssignments } from "../services/assignmentServices";
import formatDate from "../utils/formatDate";
import { formatSchedule } from "../utils/schedule";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentClasses = async () => {
      try {
        const [classData, assignmentData] = await Promise.all([
          getStudentEnrollments(),
          getAssignments(),
        ]);
        setClasses(classData.classes ?? []);
        setAssignments(assignmentData.assignments ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your dashboard right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentClasses();
  }, []);

  const openAssignments = assignments.filter(
    (assignment) => !assignment.submission_id,
  );
  const submittedAssignments = assignments.filter(
    (assignment) => assignment.submission_id,
  );
  const gradedAssignments = assignments.filter(
    (assignment) => assignment.grade !== null && assignment.grade !== undefined,
  );
  const stats = [
    {
      label: "Enrolled Classes",
      value: classes.length,
      icon: BookOpen,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Pending Assignments",
      value: openAssignments.length,
      icon: ClipboardList,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Submitted",
      value: submittedAssignments.length,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Graded",
      value: gradedAssignments.length,
      icon: FileCheck2,
      color: "text-cyan-400 bg-cyan-500/10",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row">
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-400">
                Student workspace
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Here&apos;s your current academic snapshot.
              </p>
            </div>

            {loading && (
              <p className="text-sm text-gray-400">Loading dashboard...</p>
            )}
            {!loading && error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            {!loading && !error && (
              <>
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-lg shadow-black/30 sm:p-5"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}
                      >
                        <stat.icon size={18} strokeWidth={1.8} />
                      </div>
                      <p className="mt-4 text-xs text-gray-400 sm:text-sm">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/30 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                          Your classes
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white">
                          Class schedule
                        </h2>
                      </div>
                      <CalendarDays size={20} className="text-gray-600" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {classes.length === 0 && (
                        <p className="text-sm text-gray-400">
                          No enrolled classes found.
                        </p>
                      )}
                      {classes.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-100">
                              {classItem.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {classItem.code}
                            </p>
                          </div>
                          <span className="shrink-0 text-right text-xs text-gray-400">
                            {formatSchedule(classItem)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/30 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                          Keep moving
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white">
                          Upcoming work
                        </h2>
                      </div>
                      <Clock3 size={20} className="text-gray-600" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {openAssignments.length === 0 && (
                        <p className="text-sm text-gray-400">
                          You are all caught up.
                        </p>
                      )}
                      {openAssignments.slice(0, 4).map((assignment) => (
                        <div
                          key={assignment.id}
                          className="rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3"
                        >
                          <p className="truncate text-sm font-medium text-gray-100">
                            {assignment.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                            <span className="truncate text-gray-500">
                              {assignment.class_code}
                            </span>
                            <span className="shrink-0 text-amber-300">
                              Due {formatDate(assignment.due_date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
