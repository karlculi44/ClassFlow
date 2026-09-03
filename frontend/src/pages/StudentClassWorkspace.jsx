import { ArrowLeft, CalendarDays, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentEnrollments } from "../services/enrollmentServices";
import { getAssignments } from "../services/assignmentServices";
import formatDate from "../utils/formatDate";

function StudentClassWorkspace() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const [classData, assignmentData] = await Promise.all([
          getStudentEnrollments(),
          getAssignments(),
        ]);
        const enrolledClass = (classData.classes ?? []).find(
          (item) => String(item.id) === String(classId),
        );
        if (!enrolledClass) {
          setError("You are not enrolled in this class.");
          return;
        }
        setClassItem(enrolledClass);
        setAssignments(
          (assignmentData.assignments ?? []).filter(
            (assignment) => String(assignment.class_id) === String(classId),
          ),
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load this class right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [classId]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/classes")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Classes
          </button>
          {loading && (
            <p className="mt-6 text-sm text-gray-400">Loading class...</p>
          )}
          {!loading && error && (
            <p className="mt-6 text-sm text-red-400">{error}</p>
          )}
          {!loading && !error && classItem && (
            <>
              <header className="mt-6 border-b border-gray-800 pb-7">
                <p className="text-sm font-medium text-indigo-400">
                  {classItem.code}
                </p>
                <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      {classItem.name}
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                      Instructor: {classItem.instructor_name}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    {classItem.status === "Archived" ? "Archived" : "Active"}
                  </span>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays size={16} className="text-cyan-400" />{" "}
                  {classItem.schedule || "Schedule pending"}
                </p>
              </header>
              <section className="mt-7">
                <div className="flex items-center gap-3">
                  <ClipboardList size={20} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Assignments
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {assignments.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No assignments for this class yet.
                    </p>
                  )}
                  {assignments.map((assignment) => {
                    const status =
                      assignment.grade !== null &&
                      assignment.grade !== undefined
                        ? "Graded"
                        : assignment.submission_id
                          ? "Submitted"
                          : "Not Submitted";
                    const color =
                      status === "Graded"
                        ? "border-blue-400/30 bg-blue-500/10 text-blue-300"
                        : status === "Submitted"
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                          : "border-gray-700 bg-gray-800 text-gray-400";
                    return (
                      <button
                        key={assignment.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/assignments/${assignment.id}/class/${classId}`,
                          )
                        }
                        className="flex w-full flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition hover:border-indigo-500/50 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {assignment.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Due {formatDate(assignment.due_date)}
                          </p>
                        </div>
                        <span
                          className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}
                        >
                          {status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentClassWorkspace;
