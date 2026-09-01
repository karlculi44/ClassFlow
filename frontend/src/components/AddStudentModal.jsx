import { Check, LoaderCircle, UserRound, X } from "lucide-react";
import { useState } from "react";

function AddStudentModal({
  isOpen,
  students,
  loading,
  saving,
  error,
  onClose,
  onAdd,
}) {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const toggleStudent = (studentId) => {
    setSelectedStudentIds((currentIds) =>
      currentIds.includes(studentId)
        ? currentIds.filter((id) => id !== studentId)
        : [...currentIds, studentId],
    );
  };

  const selectedCount = selectedStudentIds.length;
  const studentLabel = selectedCount === 1 ? "student" : "students";

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
        className="flex max-h-[min(680px,calc(100vh-3rem))] w-full max-w-lg flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-400">Enrollment</p>
            <h2
              id="student-modal-title"
              className="mt-1 text-xl font-bold text-white"
            >
              Add {studentLabel}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Browse student accounts for this class.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading || saving}
            aria-label="Close student list"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-6 min-h-0 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
              <LoaderCircle size={17} className="animate-spin" />
              Loading students...
            </div>
          )}

          {!loading && error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {!loading && !error && students.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 px-4 py-12 text-center">
              <UserRound size={24} className="text-gray-600" />
              <p className="mt-3 text-sm text-gray-400">
                No available student accounts found.
              </p>
            </div>
          )}

          {!loading && !error && students.length > 0 && (
            <ul className="space-y-2">
              {students.map((student) => (
                <li
                  key={student.id}
                  className={`rounded-xl border transition ${selectedStudentIds.includes(student.id) ? "border-indigo-500/60 bg-indigo-500/10" : "border-gray-800 bg-gray-800/50 hover:border-gray-700"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    disabled={saving}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
                    aria-pressed={selectedStudentIds.includes(student.id)}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-300">
                      {student.name?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-100">
                        {student.name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {student.email}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selectedStudentIds.includes(student.id) ? "border-indigo-400 bg-indigo-500 text-white" : "border-gray-600"}`}
                    >
                      {selectedStudentIds.includes(student.id) && (
                        <Check size={14} />
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || saving}
            className="rounded-lg border border-gray-700 px-4 py-2.5 mx-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
          {students.length > 0 && (
            <button
              type="button"
              onClick={() => onAdd(selectedStudentIds)}
              disabled={loading || saving || selectedCount === 0}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Adding..." : `Add ${studentLabel}`}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default AddStudentModal;
