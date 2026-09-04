import { CalendarDays, Download, MessageSquareText, X } from "lucide-react";

function GradeDetailsModal({ assignment, loading, error, onClose }) {
  if (!assignment && !loading && !error) {
    return null;
  }

  const submission = assignment?.submission;
  const attachmentPath = submission?.attachment_url;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="grade-details-title"
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl shadow-black/50"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-800 bg-gray-900 px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Graded assignment
            </p>
            <h2
              id="grade-details-title"
              className="mt-1 truncate text-xl font-bold text-white"
            >
              {assignment?.title || "Loading grade"}
            </h2>
            {assignment && (
              <p className="mt-1 text-sm text-gray-400">
                {assignment.class_name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close grade details"
            className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </header>

        {loading && (
          <p className="p-7 text-sm text-gray-400">Loading submission...</p>
        )}
        {!loading && error && (
          <p className="p-7 text-sm text-red-400">{error}</p>
        )}
        {!loading && assignment && submission && (
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_220px]">
            <div>
              <div className="flex flex-wrap gap-4 border-b border-gray-800 pb-5 text-sm">
                <span className="inline-flex items-center gap-2 text-gray-400">
                  <CalendarDays size={16} className="text-cyan-400" /> Submitted{" "}
                  {submission.submitted_at
                    ? new Date(submission.submitted_at).toLocaleDateString()
                    : "Date unavailable"}
                </span>
              </div>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Submitted work
              </h3>
              <div className="mt-3 min-h-36 rounded-xl border border-gray-800 bg-gray-900 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {submission.content || "No written work submitted."}
                </p>
              </div>
              {submission.attachment_name && attachmentPath && (
                <a
                  href={`http://localhost:3000${attachmentPath}`}
                  target="_blank"
                  rel="noreferrer"
                  download={submission.attachment_name}
                  className="mt-4 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm font-semibold text-indigo-400 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  <Download size={16} strokeWidth={1.8} />
                  <span className="truncate">{submission.attachment_name}</span>
                </a>
              )}
              {submission.feedback && (
                <div className="mt-6 border-t border-gray-800 pt-5">
                  <h3 className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    <MessageSquareText size={15} /> Instructor feedback
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                    {submission.feedback}
                  </p>
                </div>
              )}
            </div>
            <aside className="h-fit rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Grade
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                {submission.grade}
              </p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default GradeDetailsModal;
