function AddAdminModal({
  isOpen,
  formData,
  loading,
  error,
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
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-admin-title"
        className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h2
              id="add-admin-title"
              className="mt-1 text-xl font-bold text-white"
            >
              Add Admin
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Create an administrator account for ClassFlow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close add admin modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              &times;
            </span>
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5 text-sm text-gray-300">
            Full name
            <input
              required
              minLength={3}
              maxLength={100}
              name="name"
              value={formData.name}
              onChange={onChange}
              autoComplete="name"
              placeholder="Alex Morgan"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-gray-300">
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-gray-300">
            Temporary password
            <input
              required
              minLength={6}
              maxLength={128}
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500"
            />
          </label>

          {error && (
            <p
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddAdminModal;
