import { BookOpen, CalendarDays, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentEnrollments } from "../services/enrollmentServices";

const statusClasses = {
  Active: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  Archived: "border-gray-700 bg-gray-800 text-gray-400",
};

function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getStudentEnrollments();
        setClasses(data.classes ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your classes right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Student workspace
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              My Classes
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Your enrolled classes and course details.
            </p>
          </header>

          {loading && (
            <p className="text-sm text-gray-400">Loading classes...</p>
          )}
          {!loading && error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && classes.length === 0 && (
            <p className="text-sm text-gray-400">
              You are not enrolled in any classes yet.
            </p>
          )}
          {!loading && !error && classes.length > 0 && (
            <section
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              aria-label="Enrolled classes"
            >
              {classes.map((classItem, index) => {
                const status =
                  classItem.status === "Archived" ? "Archived" : "Active";
                return (
                  <article
                    key={classItem.id}
                    className="group flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-indigo-500/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`h-2 w-12 rounded-full ${["bg-indigo-400", "bg-cyan-400", "bg-amber-400", "bg-rose-400"][index % 4]}`}
                      />
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {classItem.code}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {classItem.name}
                    </h2>
                    <dl className="mt-6 space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <UserRound
                          size={17}
                          className="mt-0.5 shrink-0 text-indigo-400"
                        />
                        <div>
                          <dt className="text-xs text-gray-500">Instructor</dt>
                          <dd className="mt-1 text-gray-300">
                            {classItem.instructor_name ||
                              "Instructor unavailable"}
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-cyan-400"
                        />
                        <div>
                          <dt className="text-xs text-gray-500">Schedule</dt>
                          <dd className="mt-1 text-gray-300">
                            {classItem.schedule || "Schedule pending"}
                          </dd>
                        </div>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => navigate(`/classes/${classItem.id}`)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                    >
                      <BookOpen size={16} /> View Class
                    </button>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Classes;
