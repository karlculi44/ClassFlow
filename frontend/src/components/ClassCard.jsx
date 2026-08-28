function ClassCard({ classItem }) {
  const students = classItem.students ?? classItem.enrolledStudents ?? 0;
  const status = classItem.status ?? "Active";
  const enrollmentPercent = Math.round((students / classItem.capacity) * 100);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`h-2 w-12 rounded-full ${classItem.accent ?? "bg-indigo-500"}`}
        />
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          {status}
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
        <div className="flex items-center justify-between gap-4">
          <dt className="text-gray-500">Schedule</dt>
          <dd className="text-right text-gray-300">{classItem.schedule}</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Enrollment</span>
          <span className="font-medium text-white">
            {students} / {classItem.capacity}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full rounded-full ${classItem.accent ?? "bg-indigo-500"}`}
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

export default ClassCard;
