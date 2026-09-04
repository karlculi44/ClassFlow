import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../services/classServices";
import { getAdminAssignments } from "../services/assignmentServices";
import { getAdminSubmissions } from "../services/submissionServices";
import { getStudents } from "../services/userServices";
import formatDate from "../utils/formatDate";

const getAssignmentStatus = (assignment) => {
  const dueDate = new Date(
    `${String(assignment.due_date).slice(0, 10)}T23:59:59`,
  );
  const submitted = Number(assignment.submittedCount ?? 0);
  const total = Number(assignment.totalStudents ?? 0);

  if (new Date() > dueDate) {
    return {
      label: "Closed",
      className: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    };
  }

  if (total > 0 && submitted >= total) {
    return {
      label: "Complete",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  return {
    label: submitted > 0 ? "In progress" : "Open",
    className:
      submitted > 0
        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
        : "border-gray-700 bg-gray-800 text-gray-400",
  };
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentsExpanded, setAssignmentsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [classData, studentData] = await Promise.all([
          getClasses(),
          getStudents(),
        ]);
        const loadedClasses = classData.classes ?? [];
        const assignmentGroups = await Promise.all(
          loadedClasses.map(async (classItem) => {
            const assignmentData = await getAdminAssignments(classItem.id);
            return Promise.all(
              (assignmentData.data ?? []).map(async (assignment) => {
                const submissionData = await getAdminSubmissions(
                  classItem.id,
                  assignment.id,
                );
                return {
                  ...assignment,
                  className: classItem.name,
                  submittedCount: submissionData.assignment.submitted_count,
                  totalStudents: submissionData.assignment.total_students,
                };
              }),
            );
          }),
        );

        setClasses(loadedClasses);
        setStudents(studentData.students ?? []);
        setAssignments(assignmentGroups.flat());
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load the admin dashboard right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const submittedCount = assignments.reduce(
    (total, assignment) => total + assignment.submittedCount,
    0,
  );
  const fullySubmittedCount = assignments.filter(
    (assignment) =>
      assignment.submittedCount > 0 &&
      assignment.submittedCount === assignment.totalStudents,
  ).length;
  const sortedAssignments = [...assignments].sort(
    (firstAssignment, secondAssignment) =>
      new Date(firstAssignment.due_date) - new Date(secondAssignment.due_date),
  );
  const visibleAssignments = assignmentsExpanded
    ? sortedAssignments
    : sortedAssignments.slice(0, 5);
  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      label: "Active Classes",
      value: classes.filter((classItem) => classItem.status === "Active")
        .length,
      icon: BookOpen,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Assignments",
      value: assignments.length,
      icon: ClipboardList,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Submissions",
      value: submittedCount,
      icon: CheckCircle2,
      color: "text-cyan-400 bg-cyan-500/10",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              A live overview of your classes, assignments, and student
              progress.
            </p>
          </header>

          {loading && (
            <p className="text-sm text-gray-400">Loading dashboard...</p>
          )}
          {!loading && error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && (
            <>
              <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
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
              </section>

              <section className="grid min-w-0 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="min-w-0 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/30 sm:p-6">
                  <div className="flex min-w-0 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        Teaching overview
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-white">
                        Your classes
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/admin-classes")}
                      className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="mt-5 space-y-3">
                    {classes.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No classes created yet.
                      </p>
                    )}
                    {classes.map((classItem) => (
                      <button
                        key={classItem.id}
                        type="button"
                        onClick={() =>
                          navigate(`/admin-classes/${classItem.id}`)
                        }
                        className="flex min-w-0 w-full items-center justify-between gap-4 overflow-hidden rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3 text-left transition hover:border-indigo-500/50 hover:bg-gray-800/70"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-100">
                            {classItem.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {classItem.code} ·{" "}
                            {classItem.schedule || "Schedule pending"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${classItem.status === "Active" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-gray-700 bg-gray-800 text-gray-400"}`}
                        >
                          {classItem.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/30 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Assignments
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Assignments needing attention
                  </h2>
                  <div className="mt-5 space-y-3">
                    {assignments.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No assignments created yet.
                      </p>
                    )}
                    {visibleAssignments.map((assignment) => {
                      const status = getAssignmentStatus(assignment);
                      return (
                        <button
                          key={`${assignment.class_id}-${assignment.id}`}
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin-classes/${assignment.class_id}/assignments/${assignment.id}`,
                            )
                          }
                          className="flex h-24 min-w-0 w-full flex-col justify-center overflow-hidden rounded-xl border border-gray-800 bg-gray-950/60 px-4 text-left transition hover:border-indigo-500/50 hover:bg-gray-800/70"
                        >
                          <div className="flex min-w-0 items-start justify-between gap-3">
                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-100">
                              {assignment.title}
                            </p>
                            <span
                              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                            <span className="min-w-0 flex-1 truncate text-gray-500">
                              {assignment.className}
                            </span>
                            <span className="shrink-0 text-cyan-300">
                              {assignment.submittedCount}/
                              {assignment.totalStudents} submitted
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600">
                            Due {formatDate(assignment.due_date)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {assignments.length > 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setAssignmentsExpanded((expanded) => !expanded)
                      }
                      className="mt-4 inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                    >
                      {assignmentsExpanded ? "Show less" : "View all"}
                      {assignmentsExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  )}
                </div>
              </section>

              <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Workspace actions
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Keep your classes moving
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {fullySubmittedCount} assignment
                    {fullySubmittedCount === 1 ? "" : "s"} have submissions from
                    every enrolled student.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/admin-classes")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                  >
                    <BookOpen size={16} /> Manage Classes
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin-classes")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Plus size={16} /> Create Class
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
