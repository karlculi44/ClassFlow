import { formatSchedule, WEEKDAYS } from "../utils/schedule";

function ClassModal({
  isOpen,
  formData,
  loading,
  error,
  isEditing,
  onChange,
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
        aria-labelledby="create-class-title"
        className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h2
              id="create-class-title"
              className="mt-1 text-xl font-bold text-white"
            >
              {isEditing ? "Update Class" : "Create a class"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isEditing
                ? "Update the details for this class."
                : "Add the basic details for a new class."}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm text-gray-300">
              Class name
              <input
                required
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Grade 10 Mathematics"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
              />
            </label>
            <label className="space-y-1.5 text-sm text-gray-300">
              Class code
              <input
                required
                name="code"
                value={formData.code}
                onChange={onChange}
                placeholder="MATH-10A"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
              />
            </label>
          </div>

          <div className="block space-y-1.5 text-sm text-gray-300">
            Schedule
            <span className="block text-xs text-gray-500">Days</span>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {WEEKDAYS.map((day) => {
                const selected = formData.schedule_days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      onChange({
                        target: {
                          name: "schedule_days",
                          value: day,
                          type: "day",
                        },
                      })
                    }
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${selected ? "border-indigo-400 bg-indigo-500 text-white" : "border-gray-700 bg-gray-950 text-gray-400 hover:border-indigo-500"}`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs text-gray-500">
                Start Time
                <input
                  type="time"
                  name="schedule_start_time"
                  value={formData.schedule_start_time}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5 text-xs text-gray-500">
                End Time
                <input
                  type="time"
                  name="schedule_end_time"
                  value={formData.schedule_end_time}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </label>
            </div>
            <p className="pt-1 text-xs text-gray-500">Schedule Preview</p>
            <p className="text-sm text-gray-300">{formatSchedule(formData)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm text-gray-300">
              Capacity
              <input
                required
                min="1"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
              />
            </label>
            <label className="space-y-1.5 text-sm text-gray-300">
              Status
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className={
                  formData.status === "Active"
                    ? "w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                    : "w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-red-400 outline-none focus:border-red-500"
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

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
              {loading ? "Saving..." : isEditing ? "Save" : "Create class"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ClassModal;
