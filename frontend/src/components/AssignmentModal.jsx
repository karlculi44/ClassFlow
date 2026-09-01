import { X } from "lucide-react";

function AssignmentModal({
  isOpen,
  formData,
  loading,
  error,
  onChange,
  onFileChange,
  onClearAttachment,
  onClose,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
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
        aria-labelledby="create-assignment-title"
        className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-400">Assignment</p>
            <h2
              id="create-assignment-title"
              className="mt-1 text-xl font-bold text-white"
            >
              Create assignment
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Add the details for a new assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              &times;
            </span>
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5 text-sm text-gray-300">
            Title
            <input
              required
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Chapter 3 Homework"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-gray-300">
            Description
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              placeholder="Describe the assignment..."
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-gray-300">
            Due date
            <input
              required
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-gray-300">
            Attachment
            <input
              type="file"
              name="attachment"
              onChange={onFileChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-400 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-200 hover:file:bg-gray-700 focus:border-indigo-500"
            />
          </label>

          {formData.attachment && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-300">
              <span className="truncate">{formData.attachment.name}</span>
              <button
                type="button"
                onClick={onClearAttachment}
                aria-label="Remove attachment"
                className="rounded-md p-1 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create assignment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AssignmentModal;
