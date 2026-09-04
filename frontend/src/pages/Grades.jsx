import {
  Award,
  CalendarDays,
  ChevronDown,
  MessageSquareText,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAssignmentDetails,
  getAssignments,
} from "../services/assignmentServices";
import { getStudentEnrollments } from "../services/enrollmentServices";
import GradeDetailsModal from "../components/GradeDetailsModal";
import formatDate from "../utils/formatDate";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classFilter, setClassFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const [assignmentData, classData] = await Promise.all([
          getAssignments(),
          getStudentEnrollments(),
        ]);
        setGrades(
          (assignmentData.assignments ?? []).filter(
            (assignment) =>
              assignment.grade !== null && assignment.grade !== undefined,
          ),
        );
        setClasses(classData.classes ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your grades right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const filteredGrades = grades.filter(
    (assignment) =>
      classFilter === "all" || assignment.class_name === classFilter,
  );

  const handleView = async (assignment) => {
    setSelectedAssignment(assignment);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await getAssignmentDetails(
        assignment.class_id,
        assignment.id,
      );
      setSelectedAssignment(data.assignment);
    } catch (requestError) {
      setDetailError(
        requestError.response?.data?.message ||
          "Unable to load this submission right now.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const average = grades.length
    ? Math.round(
        (grades.reduce(
          (total, assignment) => total + Number(assignment.grade),
          0,
        ) /
          grades.length) *
          100,
      ) / 100
    : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Student workspace
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Grades
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Review your graded assignments and instructor feedback.
            </p>
          </header>

          {loading && (
            <p className="text-sm text-gray-400">Loading grades...</p>
          )}
          {!loading && error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && (
            <>
              <div className="mb-6 w-full sm:max-w-xs">
                <label
                  htmlFor="class-filter"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Class
                </label>
                <div className="relative">
                  <select
                    id="class-filter"
                    value={classFilter}
                    onChange={(event) => setClassFilter(event.target.value)}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-700 bg-gray-900 px-3 pr-10 text-sm text-gray-300 outline-none transition hover:border-gray-600 focus:border-indigo-500"
                  >
                    <option value="all">All classes</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.name}>
                        {classItem.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <section className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    Overall average
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {average}%
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Graded assignments
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {grades.length}
                  </p>
                </div>
              </section>

              {filteredGrades.length === 0 ? (
                <p className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-sm text-gray-400">
                  {grades.length === 0
                    ? "No graded assignments yet."
                    : "No graded assignments match the selected class."}
                </p>
              ) : (
                <section
                  className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/20"
                  aria-label="Graded assignments"
                >
                  <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1.2fr_auto] gap-4 border-b border-gray-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
                    <span>Assignment</span>
                    <span>Class</span>
                    <span>Grade</span>
                    <span>Feedback</span>
                    <span />
                  </div>
                  <div className="divide-y divide-gray-800">
                    {filteredGrades.map((assignment) => (
                      <article
                        key={assignment.id}
                        className="grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_1fr_0.8fr_1.2fr_auto] md:items-center"
                      >
                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-semibold text-white">
                            {assignment.title}
                          </h2>
                          <p className="mt-1 text-xs text-gray-500">
                            Submitted {formatDate(assignment.submitted_at)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300">
                          {assignment.class_name}
                        </p>
                        <p className="text-lg font-bold text-emerald-300">
                          {assignment.grade}/100
                        </p>
                        <div className="text-sm text-gray-400">
                          <p className="inline-flex items-center gap-2 text-indigo-300 mr-5">
                            <Award size={15} /> {assignment.instructor_name}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-2 text-xs text-gray-500">
                            <MessageSquareText size={14} />{" "}
                            {assignment.feedback
                              ? "Feedback available"
                              : "No feedback"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleView(assignment)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                        >
                          <CalendarDays size={15} /> View
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <GradeDetailsModal
        assignment={selectedAssignment}
        loading={detailLoading}
        error={detailError}
        onClose={() => {
          setSelectedAssignment(null);
          setDetailError("");
        }}
      />
    </div>
  );
}

export default Grades;
