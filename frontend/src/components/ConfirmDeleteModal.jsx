import { AlertTriangle } from "lucide-react";
import { useState } from "react";

function ConfirmDeleteModal({
  isOpen,
  className,
  itemLabel = "class",
  loading,
  error,
  onClose,
  onConfirm,
}) {
  const [confirmationValue, setConfirmationValue] = useState("");
  const confirmationText = `delete ${className}`;

  if (!isOpen) {
    return null;
  }

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
        aria-labelledby="delete-class-title"
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300"
          role="alert"
        >
          <AlertTriangle size={20} strokeWidth={2} />
          <h1 className="text-lg font-bold tracking-wide">Caution</h1>
        </div>

        <div className="flex items-start gap-4">
          <div>
            <h2
              id="delete-class-title"
              className="text-xl font-bold text-white"
            >
              Delete {itemLabel}?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Are you sure you want to delete this {itemLabel}?
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              This will permanently delete{" "}
              <span className="font-medium text-gray-200">{className}</span>.
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              This action <b className="text-red-400">CAN NOT</b> be undone.
            </p>
          </div>
        </div>

        <label className="mt-6 block space-y-2 text-sm text-gray-300">
          Type{" "}
          <span className="font-semibold text-white">`{confirmationText}`</span>{" "}
          to confirm.
          <input
            type="text"
            value={confirmationValue}
            onChange={(event) => setConfirmationValue(event.target.value)}
            aria-label={`Type ${confirmationText} to confirm deletion`}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 mt-3 text-white outline-none placeholder:text-gray-600 focus:border-red-500"
          />
        </label>

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
            disabled={loading || confirmationValue !== confirmationText}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : `Delete ${itemLabel}`}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDeleteModal;
