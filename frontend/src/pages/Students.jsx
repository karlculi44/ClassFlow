import { Search, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAdminStudentDetails,
  getAdminStudents,
} from "../services/enrollmentServices";
import { getClasses } from "../services/classServices";
import formatDate from "../utils/formatDate";

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classCount, setClassCount] = useState(0);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const [data, classData] = await Promise.all([
          getAdminStudents(),
          getClasses(),
        ]);
        setStudents(data.students ?? []);
        setClasses(classData.classes ?? []);
        setClassCount((classData.classes ?? []).length);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load students right now.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);
    const matchesClass =
      !classFilter || student.class_names?.split(", ").includes(classFilter);
    return matchesSearch && matchesClass;
  });

  const handleView = async (student) => {
    setSelectedStudent({ student, classes: [], assignments: [] });
    setDetailError("");
    setDetailLoading(true);
    try {
      const data = await getAdminStudentDetails(student.id);
      setSelectedStudent(data);
    } catch (requestError) {
      setDetailError(
        requestError.response?.data?.message ||
          "Unable to load student details right now.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Students
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Students enrolled in your classes.
            </p>
          </header>

          {loading && (
            <p className="text-sm text-gray-400">Loading students...</p>
          )}
          {!loading && error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && (
            <>
              <section className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Unique students
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {students.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Classes managed
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {classCount}
                  </p>
                </div>
              </section>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative max-w-md flex-1">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3 top-3 text-gray-500"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email"
                    className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 pl-10 pr-4 text-sm text-gray-200 outline-none placeholder:text-gray-600 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={classFilter}
                  onChange={(event) => setClassFilter(event.target.value)}
                  aria-label="Filter by class"
                  className="h-11 rounded-lg border border-gray-700 bg-gray-900 px-3 text-sm text-gray-300 outline-none focus:border-indigo-500"
                >
                  <option value="">All classes</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
              <section
                className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/20"
                aria-label="Enrolled students"
              >
                <div className="hidden grid-cols-[1.2fr_1.4fr_0.7fr_1.2fr_auto] gap-4 border-b border-gray-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
                  <span>Student</span>
                  <span>Email</span>
                  <span>Classes</span>
                  <span>Enrollment</span>
                  <span />
                </div>
                <div className="divide-y divide-gray-800">
                  {filteredStudents.length === 0 && (
                    <p className="px-5 py-8 text-sm text-gray-400">
                      No students match your search.
                    </p>
                  )}
                  {filteredStudents.map((student) => (
                    <article
                      key={student.id}
                      className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1.4fr_0.7fr_1.2fr_auto] md:items-center"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {student.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {student.role}
                        </p>
                      </div>
                      <p className="text-sm text-gray-300">{student.email}</p>
                      <p className="text-sm text-gray-300">
                        {student.class_count}
                      </p>
                      <p className="text-sm text-gray-400">
                        Enrolled in {student.class_count} class
                        {student.class_count === 1 ? "" : "es"}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleView(student)}
                        className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                      >
                        View
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelectedStudent(null)
          }
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-details-title"
            className="my-auto max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl shadow-black/50"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-800 bg-gray-900 px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                  Student details
                </p>
                <h2
                  id="student-details-title"
                  className="mt-1 text-xl font-bold text-white"
                >
                  {selectedStudent.student.name}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedStudent.student.email} ·{" "}
                  {selectedStudent.student.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student details"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <X size={19} />
              </button>
            </header>
            {detailLoading && (
              <p className="p-7 text-sm text-gray-400">
                Loading student details...
              </p>
            )}
            {!detailLoading && detailError && (
              <p className="p-7 text-sm text-red-400">{detailError}</p>
            )}
            {!detailLoading && !detailError && (
              <div className="space-y-7 p-5 sm:p-7">
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Users size={19} className="text-indigo-400" /> Enrolled
                    classes
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {selectedStudent.classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-4"
                      >
                        <p className="font-semibold text-white">
                          {classItem.name}
                        </p>
                        <p className="mt-1 text-xs text-indigo-300">
                          {classItem.code}
                        </p>
                        <p className="mt-3 text-sm text-gray-400">
                          {classItem.schedule || "Schedule pending"}
                        </p>
                        <span className="mt-3 inline-block rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                          {classItem.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-white">
                    Assignments
                  </h3>
                  <div className="mt-4 divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900">
                    {selectedStudent.assignments.length === 0 && (
                      <p className="p-4 text-sm text-gray-400">
                        No assignments in these classes.
                      </p>
                    )}
                    {selectedStudent.assignments.map((assignment) => {
                      const submitted = Boolean(assignment.submission_id);
                      const graded =
                        assignment.grade !== null &&
                        assignment.grade !== undefined;
                      return (
                        <div
                          key={assignment.id}
                          className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {assignment.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {assignment.class_name} · Due{" "}
                              {formatDate(assignment.due_date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs ${graded ? "border-blue-400/30 bg-blue-500/10 text-blue-300" : submitted ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-gray-700 bg-gray-800 text-gray-400"}`}
                            >
                              {graded
                                ? "Graded"
                                : submitted
                                  ? "Submitted"
                                  : "Not Submitted"}
                            </span>
                            {graded && (
                              <span className="font-semibold text-emerald-300">
                                {assignment.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Students;
