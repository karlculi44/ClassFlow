import { useEffect, useState } from "react";
import { getClassReport, getReportSummary } from "../services/reportServices";

const formatAverage = (value) =>
  value === null || value === undefined
    ? "-"
    : `${Number(value).toFixed(2).replace(/\.00$/, "")}`;

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

function Reports() {
  const [summary, setSummary] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classReport, setClassReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getReportSummary();
        setSummary(data);
        if (data.classes?.length) {
          setSelectedClassId(String(data.classes[0].id));
        }
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, "Unable to load reports right now."),
        );
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      return;
    }

    const loadClassReport = async () => {
      setDetailsLoading(true);
      setDetailsError("");
      try {
        const data = await getClassReport(selectedClassId);
        setClassReport(data);
      } catch (requestError) {
        setDetailsError(
          getErrorMessage(requestError, "Unable to load this class report."),
        );
      } finally {
        setDetailsLoading(false);
      }
    };

    loadClassReport();
  }, [selectedClassId]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Reports
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Academic activity and performance across your classes.
            </p>
          </header>

          {loading && (
            <p className="text-sm text-gray-400">Loading reports...</p>
          )}
          {!loading && error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && summary && (
            <>
              <section
                className="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/20"
                aria-label="Class performance"
              >
                <div className="border-b border-gray-800 px-5 py-5 sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Class performance
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Your classes
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-190 text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-5 py-3 font-medium">Class</th>
                        <th className="px-5 py-3 font-medium">Students</th>
                        <th className="px-5 py-3 font-medium">Assignments</th>
                        <th className="px-5 py-3 font-medium">Submissions</th>
                        <th className="px-5 py-3 font-medium">Average grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.classes?.map((classItem) => (
                        <tr
                          key={classItem.id}
                          className="border-b border-gray-800 last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-100">
                              {classItem.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {classItem.code}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {classItem.student_count}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {classItem.assignment_count}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {classItem.submission_count}
                          </td>
                          <td className="px-5 py-4 font-semibold text-emerald-300">
                            {formatAverage(classItem.average_grade)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!summary.classes?.length && (
                  <p className="px-5 py-6 text-sm text-gray-400">
                    No classes have been created yet.
                  </p>
                )}
              </section>

              <section
                className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 sm:p-6"
                aria-label="Class details"
              >
                <div className="flex flex-col gap-4 border-b border-gray-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Class details
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                      Performance breakdown
                    </h2>
                  </div>
                  <label className="w-full text-sm font-medium text-gray-300 sm:max-w-xs">
                    Select class
                    <select
                      value={selectedClassId}
                      onChange={(event) => {
                        setSelectedClassId(event.target.value);
                        setClassReport(null);
                      }}
                      className="mt-1.5 h-11 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-gray-200 outline-none focus:border-indigo-500"
                    >
                      <option value="">Choose a class</option>
                      {summary.classes?.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {detailsLoading && (
                  <p className="pt-6 text-sm text-gray-400">
                    Loading class details...
                  </p>
                )}
                {!detailsLoading && detailsError && (
                  <p className="pt-6 text-sm text-red-400" role="alert">
                    {detailsError}
                  </p>
                )}
                {!detailsLoading &&
                  !detailsError &&
                  selectedClassId &&
                  classReport && (
                    <div className="grid gap-6 pt-6 xl:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Student performance
                        </h3>
                        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-800">
                          <table className="w-full min-w-120 text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-4 py-3 font-medium">
                                  Student
                                </th>
                                <th className="px-4 py-3 font-medium">
                                  Submissions
                                </th>
                                <th className="px-4 py-3 font-medium">
                                  Average grade
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {classReport.students?.map((student) => (
                                <tr
                                  key={student.id}
                                  className="border-b border-gray-800 last:border-b-0"
                                >
                                  <td className="px-4 py-3 text-gray-200">
                                    {student.name}
                                  </td>
                                  <td className="px-4 py-3 text-gray-400">
                                    {student.submission_count}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-emerald-300">
                                    {formatAverage(student.average_grade)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {!classReport.students?.length && (
                          <p className="mt-3 text-sm text-gray-400">
                            No students are enrolled in this class.
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Assignment performance
                        </h3>
                        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-800">
                          <table className="w-full min-w-120 text-left text-sm">
                            <thead>
                              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-4 py-3 font-medium">
                                  Assignment
                                </th>
                                <th className="px-4 py-3 font-medium">
                                  Submissions
                                </th>
                                <th className="px-4 py-3 font-medium">
                                  Average grade
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {classReport.assignments?.map((assignment) => (
                                <tr
                                  key={assignment.id}
                                  className="border-b border-gray-800 last:border-b-0"
                                >
                                  <td className="px-4 py-3 text-gray-200">
                                    {assignment.title}
                                  </td>
                                  <td className="px-4 py-3 text-gray-400">
                                    {assignment.submission_count}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-emerald-300">
                                    {formatAverage(assignment.average_grade)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {!classReport.assignments?.length && (
                          <p className="mt-3 text-sm text-gray-400">
                            No assignments are available for this class.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;
