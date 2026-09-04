import { ClipboardList, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdminAssignments } from "../services/assignmentServices";
import { getClasses } from "../services/classServices";
import formatDate from "../utils/formatDate";

const getStatus = (assignment) => {
  const dueDate = new Date(
    `${String(assignment.due_date).slice(0, 10)}T23:59:59`,
  );
  const submitted = Number(assignment.submitted_count ?? 0);
  const total = Number(assignment.total_students ?? 0);

  if (total > 0 && submitted >= total) return "Complete";
  if (new Date() > dueDate) return "Closed";
  if (submitted > 0) return "In progress";
  return "Open";
};

const statusClassName = {
  Complete: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  Closed: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  "In progress": "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Open: "border-gray-700 bg-gray-800 text-gray-400",
};

function AdminAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const [assignmentData, classData] = await Promise.all([
          getAllAdminAssignments(),
          getClasses(),
        ]);
        setAssignments(assignmentData.assignments ?? []);
        setClasses(classData.classes ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load assignments right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesClass =
        classFilter === "all" || String(assignment.class_id) === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [assignments, classFilter, search]);

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
              Assignments
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage assignments across your classes.
            </p>
          </header>

          <div className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
            <label className="relative block text-sm font-medium text-gray-300">
              <span className="sr-only">Search assignments</span>
              <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignment titles"
                className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 pl-10 pr-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-indigo-500"
              />
            </label>
            <label className="text-sm font-medium text-gray-300">
              <span className="sr-only">Filter by class</span>
              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 text-sm text-gray-200 outline-none focus:border-indigo-500"
              >
                <option value="all">All classes</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading && (
            <p className="text-sm text-gray-400">Loading assignments...</p>
          )}
          {!loading && error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && filteredAssignments.length === 0 && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-gray-600" />
              <p className="mt-3 text-sm text-gray-400">
                {assignments.length === 0
                  ? "No assignments have been created yet."
                  : "No assignments match your search or class filter."}
              </p>
            </div>
          )}
          {!loading && !error && filteredAssignments.length > 0 && (
            <section
              className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/20"
              aria-label="Admin assignments"
            >
              <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-gray-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
                <span>Assignment</span>
                <span>Class</span>
                <span>Due date</span>
                <span>Submissions</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-gray-800">
                {filteredAssignments.map((assignment) => {
                  const status = getStatus(assignment);
                  return (
                    <button
                      key={`${assignment.class_id}-${assignment.id}`}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin-classes/${assignment.class_id}/assignments/${assignment.id}`,
                        )
                      }
                      className="grid w-full gap-3 px-5 py-5 text-left transition hover:bg-gray-800/60 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">
                          {assignment.title}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500 md:hidden">
                          {assignment.class_name}
                        </span>
                      </span>
                      <span className="hidden text-sm text-gray-300 md:block">
                        {assignment.class_name}
                      </span>
                      <span className="text-sm text-gray-400">
                        Due {formatDate(assignment.due_date)}
                      </span>
                      <span className="text-sm text-gray-300">
                        {assignment.submitted_count}/{assignment.total_students}{" "}
                        submitted
                      </span>
                      <span
                        className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassName[status]}`}
                      >
                        {status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminAssignments;
