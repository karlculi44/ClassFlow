import { AlertTriangle, X } from "lucide-react";

function RemoveStudentsModal({
  isOpen,
  students,
  loading,
  error,
  onClose,
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  const studentLabel = students.length === 1 ? "student" : "students";

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-students-title"
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-400">Enrollment</p>
            <h2
              id="remove-students-title"
              className="mt-1 text-xl font-bold text-white"
            >
              Remove {studentLabel}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close remove students dialog"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertTriangle size={19} className="mt-0.5 shrink-0" />
          <p>
            The selected {studentLabel} will be unenrolled from this class.
            Their student accounts will not be deleted.
          </p>
        </div>

        <ul className="mt-5 max-h-40 space-y-2 overflow-y-auto text-sm text-gray-300">
          {students.map((student) => (
            <li key={student.id} className="truncate">
              {student.name}{" "}
              <span className="text-gray-500">({student.email})</span>
            </li>
          ))}
        </ul>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Removing..." : "Confirm Remove"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default RemoveStudentsModal;
