import { Download, Save, X } from "lucide-react";

function SubmissionDetailsModal({
  isOpen,
  student,
  submission,
  attachmentUrl,
  loading,
  saving,
  error,
  success,
  grade,
  feedback,
  onGradeChange,
  onFeedbackChange,
  onSave,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-details-title"
        className="my-auto w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Submission Details
            </p>
            <h2
              id="submission-details-title"
              className="mt-1 text-xl font-bold text-white"
            >
              {student.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{student.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close submission details"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        {loading && (
          <p className="py-6 text-sm text-gray-400">Loading submission...</p>
        )}
        {!loading && error && (
          <p className="py-4 text-sm text-red-400">{error}</p>
        )}
        {!loading && submission && (
          <div className="grid gap-6 pt-5 lg:grid-cols-[1fr_280px]">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Written Content
              </h3>
              <p className="mt-2 min-h-28 whitespace-pre-wrap rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm leading-6 text-gray-300">
                {submission.content || "No written content provided."}
              </p>
              {submission.attachment_name && (
                <a
                  href={`http://localhost:3000${attachmentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  download={submission.attachment_name}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <Download size={16} strokeWidth={1.8} />
                  {submission.attachment_name}
                </a>
              )}
            </div>
            <form onSubmit={onSave} className="space-y-4">
              <label className="block text-sm text-gray-300">
                Grade
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={grade}
                  onChange={onGradeChange}
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  required
                />
              </label>
              <label className="block text-sm text-gray-300">
                Feedback
                <textarea
                  rows={5}
                  value={feedback}
                  onChange={onFeedbackChange}
                  className="mt-2 w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  placeholder="Add feedback for the student..."
                />
              </label>
              {success && <p className="text-sm text-emerald-400">{success}</p>}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} strokeWidth={1.8} />
                {saving ? "Saving..." : "Save Grade"}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

export default SubmissionDetailsModal;
