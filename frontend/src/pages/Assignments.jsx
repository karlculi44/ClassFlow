import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../services/assignmentServices";
import formatDate from "../utils/formatDate";

const filterClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 px-3 pr-10 text-sm text-gray-300 outline-none transition hover:border-gray-600 focus:border-indigo-500";

const accentColors = [
  {
    bar: "bg-indigo-400",
    icon: "bg-indigo-500/10 text-indigo-400 group-hover:text-indigo-300",
  },
  {
    bar: "bg-cyan-400",
    icon: "bg-cyan-500/10 text-cyan-400 group-hover:text-cyan-300",
  },
  {
    bar: "bg-amber-400",
    icon: "bg-amber-500/10 text-amber-400 group-hover:text-amber-300",
  },
  {
    bar: "bg-rose-400",
    icon: "bg-rose-500/10 text-rose-400 group-hover:text-rose-300",
  },
  {
    bar: "bg-emerald-400",
    icon: "bg-emerald-500/10 text-emerald-400 group-hover:text-emerald-300",
  },
];

const statusColors = {
  "in progress": "border-blue-400/40 bg-blue-500/10 text-blue-300",
  submitted: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  graded: "border-green-400/40 bg-green-500/10 text-green-300",
};

const getAssignmentStatus = (assignment) => {
  if (assignment.grade !== null && assignment.grade !== undefined) {
    return { label: "Graded", value: "graded" };
  }

  if (assignment.submission_id) {
    return { label: "Submitted", value: "submitted" };
  }

  return { label: "In progress", value: "in-progress" };
};

function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data.assignments ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load assignments right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const classOptions = [
    ...new Map(
      assignments.map((assignment) => [
        assignment.class_id,
        { value: String(assignment.class_id), label: assignment.class_name },
      ]),
    ).values(),
  ];
  const filteredAssignments = assignments.filter((assignment) => {
    const status = getAssignmentStatus(assignment);
    const matchesClass =
      classFilter === "all" || String(assignment.class_id) === classFilter;
    const matchesStatus =
      statusFilter === "all" || status.value === statusFilter;

    return matchesClass && matchesStatus;
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Student workspace
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
              Assignments
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Keep track of upcoming work across all your classes.
            </p>
          </header>

          <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-4 shadow-lg shadow-black/20 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="class-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Class
              </label>
              <div className="relative">
                <select
                  id="class-filter"
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                  className={filterClassName}
                >
                  <option value="all">All classes</option>
                  {classOptions.map((classOption) => (
                    <option key={classOption.value} value={classOption.value}>
                      {classOption.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="status-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={filterClassName}
                >
                  <option value="all">All statuses</option>
                  <option value="in-progress">In progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </section>

          <section aria-label="Assignments list" className="space-y-3">
            {loading && (
              <p className="text-sm text-gray-400">Loading assignments...</p>
            )}
            {!loading && error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            {!loading && !error && filteredAssignments.length === 0 && (
              <p className="text-sm text-gray-400">
                {assignments.length === 0
                  ? "No assignments found for your enrolled classes."
                  : "No assignments match the selected filters."}
              </p>
            )}
            {!loading &&
              !error &&
              filteredAssignments.map((assignment) => {
                const { label: status } = getAssignmentStatus(assignment);
                const statusKey = status.toLowerCase();
                const statusColor = statusColors[statusKey];

                return (
                  <article
                    key={assignment.id}
                    tabIndex="0"
                    role="button"
                    onClick={() =>
                      navigate(
                        `/assignments/${assignment.id}/class/${assignment.class_id}`,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(
                          `/assignments/${assignment.id}/class/${assignment.class_id}`,
                        );
                      }
                    }}
                    className="group relative cursor-pointer rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 outline-none transition duration-200 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-gray-900/95 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <div
                      className={`absolute inset-y-5 left-0 w-1 rounded-r-full ${accentColors[assignment.id % accentColors.length].bar}`}
                    />
                    <div className="flex flex-col gap-5 pl-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 rounded-lg border border-gray-700 p-2 transition ${accentColors[assignment.id % accentColors.length].icon}`}
                          >
                            <FileText size={18} strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                              {assignment.title}
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                              {assignment.class_name}
                              <span className="mx-2 text-gray-700">/</span>
                              <span className="text-gray-500">
                                {assignment.class_code}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 border-t border-gray-800 pt-4 text-sm sm:border-0 sm:pt-0">
                        <div className="flex items-center gap-2 text-gray-400">
                          <CalendarDays size={16} className="text-gray-500" />
                          <span>
                            Due on {formatDate(assignment.due_date)} | 11:59PM
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor}`}
                        >
                          <Clock3 size={14} />
                          {status}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Assignments;
