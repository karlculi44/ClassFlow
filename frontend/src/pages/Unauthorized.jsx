import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 overflow-hidden">
      {/* Ambience background */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8 text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Access Denied
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          You don&apos;t have permission to view this page. If you think this is
          a mistake, contact your administrator.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold px-5 py-2.5 transition"
          >
            Back to Login
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-semibold px-5 py-2.5 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
