import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import formatDate from "../utils/formatDate";
import {
  getAdminStudentSubmission,
  getAdminSubmissions,
  gradeSubmission,
} from "../services/submissionServices";
import SubmissionDetailsModal from "../components/SubmissionDetailsModal";

function Submissions() {
  const { classId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await getAdminSubmissions(classId, assignmentId);
        setData(response);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load submissions right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, classId]);

  const handleView = async (student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setSelectedSubmission(null);
      return;
    }

    setSelectedStudent(student);
    setSelectedSubmission(null);
    setDetailError("");
    setSuccess("");

    if (!student.submission) {
      return;
    }

    setDetailLoading(true);
    try {
      const response = await getAdminStudentSubmission(
        classId,
        assignmentId,
        student.id,
      );
      setSelectedSubmission(response.submission);
      setGrade(response.submission.grade ?? "");
      setFeedback(response.submission.feedback ?? "");
    } catch (requestError) {
      setDetailError(
        requestError.response?.data?.message ||
          "Unable to load this submission right now.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setDetailError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await gradeSubmission(
        classId,
        assignmentId,
        selectedStudent.id,
        { grade, feedback },
      );
      setSelectedSubmission(response.submission);
      const submissionsResponse = await getAdminSubmissions(
        classId,
        assignmentId,
      );
      setData(submissionsResponse);
      setSelectedStudent(null);
      setSelectedSubmission(null);
    } catch (requestError) {
      setDetailError(
        requestError.response?.data?.message ||
          "Unable to save the grade right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  const attachmentUrl = selectedSubmission?.attachment_url;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() =>
            navigate(`/admin-classes/${classId}/assignments/${assignmentId}`)
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Assignment
        </button>

        {loading && (
          <p className="mt-6 text-sm text-gray-400">Loading submissions...</p>
        )}
        {!loading && error && (
          <p className="mt-6 text-sm text-red-400">{error}</p>
        )}
        {!loading && !error && data && (
          <section className="mt-6 max-w-6xl">
            <header className="border-b border-gray-800 pb-7">
              <p className="text-sm font-medium text-indigo-400">
                Assignment Submissions
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {data.assignment.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
                <span>
                  Due {formatDate(data.assignment.due_date)} | 11:59 PM
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={15} strokeWidth={1.8} />
                  {data.assignment.submitted_count} /{" "}
                  {data.assignment.total_students} submitted
                </span>
              </div>
            </header>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
              <table className="w-full min-w-180 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-medium">Student Name</th>
                    <th className="px-4 py-3 font-medium">Submission Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((student) => {
                    const submitted = Boolean(student.submission);
                    const graded =
                      submitted && student.submission.grade !== null;
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-800 last:border-b-0"
                      >
                        <td className="px-4 py-4 text-gray-200">
                          {student.name}
                        </td>
                        <td className="px-4 py-4 text-gray-400">
                          {submitted
                            ? formatDate(student.submission.submitted_at)
                            : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${graded ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400" : submitted ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-gray-700 bg-gray-800 text-gray-500"}`}
                          >
                            {graded
                              ? "Graded"
                              : submitted
                                ? "Submitted"
                                : "Not Submitted"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {graded ? `${student.submission.grade}/100` : "-"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleView(student)}
                            disabled={!submitted}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {selectedStudent?.id === student.id ? (
                              <EyeOff size={15} strokeWidth={1.8} />
                            ) : (
                              <Eye size={15} strokeWidth={1.8} />
                            )}
                            {selectedStudent?.id === student.id
                              ? "Hide"
                              : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <SubmissionDetailsModal
        isOpen={Boolean(selectedStudent)}
        student={selectedStudent}
        submission={selectedSubmission}
        attachmentUrl={attachmentUrl}
        loading={detailLoading}
        saving={saving}
        error={detailError}
        success={success}
        grade={grade}
        feedback={feedback}
        onGradeChange={(event) => setGrade(event.target.value)}
        onFeedbackChange={(event) => setFeedback(event.target.value)}
        onSave={handleSave}
        onClose={() => {
          setSelectedStudent(null);
          setSelectedSubmission(null);
        }}
      />
    </div>
  );
}

export default Submissions;
