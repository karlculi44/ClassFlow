import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatSchedule, isScheduleActive } from "../utils/schedule";

function ClassCard({ classItem, onEdit, onDelete, currentTime }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const students = classItem.students ?? classItem.enrolledStudents ?? 0;
  const status = isScheduleActive(classItem, currentTime)
    ? "Active"
    : "Inactive";
  const statusClassName =
    status === "Active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : "border-gray-500/20 bg-gray-500/10 text-gray-400";
  const enrollmentPercent = Math.round((students / classItem.capacity) * 100);

  const goToClassWorkspace = () => navigate(`/admin-classes/${classItem.id}`);

  return (
    <article
      onClick={goToClassWorkspace}
      className="relative flex h-full cursor-pointer flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-gray-700"
    >
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen((isOpen) => !isOpen);
          }}
          aria-label={`More options for ${classItem.name}`}
          aria-expanded={menuOpen}
          title="More options"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <MoreVertical size={17} strokeWidth={1.8} />
        </button>

        {menuOpen && (
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-11 z-10 w-36 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-xl shadow-black/40"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(classItem);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              <Pencil size={15} strokeWidth={1.8} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(classItem);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash size={15} strokeWidth={1.8} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 pr-10">
        <div
          className={`h-2 w-12 rounded-full ${classItem.accent ?? "bg-indigo-500"}`}
        />
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassName}`}
        >
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
          <dd className="text-right text-gray-300">
            {formatSchedule(classItem)}
          </dd>
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

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          goToClassWorkspace();
        }}
        className="mt-5 w-full rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
      >
        View class
      </button>
    </article>
  );
}

export default ClassCard;
