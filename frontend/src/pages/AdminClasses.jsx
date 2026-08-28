const classes = [
  {
    name: "Grade 10 Mathematics",
    code: "MATH-10A",
    schedule: "Mon, Wed, Fri · 9:00 AM",
    students: 32,
    capacity: 40,
    accent: "bg-indigo-500",
  },
  {
    name: "Grade 10 Physics",
    code: "PHYS-10B",
    schedule: "Tue, Thu · 11:00 AM",
    students: 28,
    capacity: 30,
    accent: "bg-cyan-500",
  },
  {
    name: "English Literature",
    code: "ENGL-11A",
    schedule: "Mon, Wed · 1:30 PM",
    students: 24,
    capacity: 32,
    accent: "bg-amber-500",
  },
  {
    name: "Grade 9 Biology",
    code: "BIOL-09C",
    schedule: "Tue, Thu · 2:00 PM",
    students: 26,
    capacity: 30,
    accent: "bg-emerald-500",
  },
  {
    name: "World History",
    code: "HIST-11B",
    schedule: "Mon, Fri · 10:00 AM",
    students: 21,
    capacity: 30,
    accent: "bg-rose-500",
  },
  {
    name: "Computer Science",
    code: "COMP-12A",
    schedule: "Wed, Fri · 3:00 PM",
    students: 18,
    capacity: 24,
    accent: "bg-violet-500",
  },
];

function ClassCard({ classItem }) {
  const enrollmentPercent = Math.round(
    (classItem.students / classItem.capacity) * 100,
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className={`h-2 w-12 rounded-full ${classItem.accent}`} />
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          Active
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {classItem.code}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          {classItem.name}
        </h2>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4"></div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-500">Schedule</dt>
          <dd className="text-right text-gray-300">{classItem.schedule}</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Enrollment</span>
          <span className="font-medium text-white">
            {classItem.students} / {classItem.capacity}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full rounded-full ${classItem.accent}`}
            style={{ width: `${enrollmentPercent}%` }}
          />
        </div>
      </div>

      <button className="mt-5 w-full rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white">
        View class
      </button>
    </article>
  );
}

function AdminClasses() {
  const totalStudents = classes.reduce(
    (total, classItem) => total + classItem.students,
    0,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-gray-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Classes
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage class schedules, teachers, and enrollment.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700">
            Create class
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4 border-b border-gray-800 py-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total classes
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {classes.length}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Enrolled students
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {totalStudents}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Active classes
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {classes.length}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 py-8 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <ClassCard key={classItem.code} classItem={classItem} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default AdminClasses;
