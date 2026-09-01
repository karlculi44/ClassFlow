import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
} from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Quadratic Equations Practice",
    className: "Algebra II",
    code: "MATH 204",
    dueDate: "Sep 3, 2026",
    status: "Not started",
    statusTone: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    accent: "bg-amber-400",
  },
  {
    id: 2,
    title: "Newton's Laws Lab Report",
    className: "Physics",
    code: "PHYS 118",
    dueDate: "Sep 5, 2026",
    status: "In progress",
    statusTone: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    accent: "bg-indigo-400",
  },
  {
    id: 3,
    title: "The Great Gatsby: Chapter Analysis",
    className: "English Literature",
    code: "ENGL 305",
    dueDate: "Sep 8, 2026",
    status: "Not started",
    statusTone: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    accent: "bg-rose-400",
  },
  {
    id: 4,
    title: "Cell Structure Quiz",
    className: "Biology",
    code: "BIOL 110",
    dueDate: "Sep 10, 2026",
    status: "Submitted",
    statusTone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    accent: "bg-emerald-400",
  },
  {
    id: 5,
    title: "Renaissance Art Study Guide",
    className: "World History",
    code: "HIST 220",
    dueDate: "Sep 12, 2026",
    status: "Not started",
    statusTone: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    accent: "bg-sky-400",
  },
];

const filterClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 px-3 pr-10 text-sm text-gray-300 outline-none transition hover:border-gray-600 focus:border-indigo-500";

function Assignments() {
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
                  defaultValue="all"
                  className={filterClassName}
                >
                  <option value="all">All classes</option>
                  <option value="math">Algebra II</option>
                  <option value="physics">Physics</option>
                  <option value="english">English Literature</option>
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
                  defaultValue="all"
                  className={filterClassName}
                >
                  <option value="all">All statuses</option>
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="submitted">Submitted</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </section>

          <section aria-label="Assignments list" className="space-y-3">
            {assignments.map((assignment) => (
              <article
                key={assignment.id}
                tabIndex="0"
                className="group relative cursor-pointer rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 outline-none transition duration-200 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-gray-900/95 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20"
              >
                <div
                  className={`absolute inset-y-5 left-0 w-1 rounded-r-full ${assignment.accent}`}
                />
                <div className="flex flex-col gap-5 pl-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg border border-gray-700 bg-gray-800/70 p-2 text-gray-400 transition group-hover:text-indigo-300">
                        <FileText size={18} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                          {assignment.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                          {assignment.className}
                          <span className="mx-2 text-gray-700">/</span>
                          <span className="text-gray-500">
                            {assignment.code}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-gray-800 pt-4 text-sm sm:border-0 sm:pt-0">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarDays size={16} className="text-gray-500" />
                      <span>Due {assignment.dueDate}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${assignment.statusTone}`}
                    >
                      {assignment.status === "Submitted" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock3 size={14} />
                      )}
                      {assignment.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Assignments;
