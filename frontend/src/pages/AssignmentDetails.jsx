import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Download, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignmentDetails } from "../services/assignmentServices";
import {
  getStudentSubmission,
  submitAssignment,
  updateSubmission,
} from "../services/submissionServices";
import formatDate from "../utils/formatDate";

function AssignmentDetails() {
  const { classId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [response, setResponse] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [editingSubmission, setEditingSubmission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignmentDetails(classId, assignmentId);
        setAssignment(data.assignment);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load this assignment right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId, classId]);

  const attachmentName = assignment?.attachment_name;
  const attachmentPath =
    assignment?.attachment_url ?? assignment?.attachhment_url;
  const submission = assignment?.submission;
  const submissionAttachmentPath = submission?.attachment_url;

  const isPastDue = () => {
    if (!assignment?.due_date) {
      return false;
    }

    const dueDateValue =
      typeof assignment.due_date === "string"
        ? assignment.due_date.slice(0, 10)
        : new Date(assignment.due_date).toISOString().slice(0, 10);
    const dueDate = new Date(`${dueDateValue}T23:59:59`);
    return new Date() > dueDate;
  };

  const handleUpdateClick = async () => {
    setError("");
    setSuccess("");
    setLoadingSubmission(true);

    try {
      const data = await getStudentSubmission(assignmentId);
      setResponse(data.submission.content ?? "");
      setAttachment(null);
      setEditingSubmission(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load your submission right now.",
      );
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!editingSubmission && isPastDue()) {
      setError("The submission deadline has passed.");
      return;
    }

    if (!response.trim() && !attachment) {
      setError("Written response or an attachment is required.");
      return;
    }

    const formData = new FormData();
    if (response.trim()) {
      formData.append("content", response.trim());
    }
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      setSubmitting(true);
      const data = editingSubmission
        ? await updateSubmission(assignmentId, formData)
        : await submitAssignment(assignmentId, formData);
      setAssignment((currentAssignment) => ({
        ...currentAssignment,
        submission: data.submission,
      }));
      setEditingSubmission(false);
      setAttachment(null);
      setSuccess(
        editingSubmission
          ? "Your submission was updated successfully."
          : "Your assignment was submitted successfully.",
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to submit this assignment right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelUpdate = () => {
    setEditingSubmission(false);
    setResponse("");
    setAttachment(null);
    setError("");
    setSuccess(
      editingSubmission
        ? "Your submission was updated successfully."
        : "Your assignment was submitted successfully.",
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/assignments")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Assignments
        </button>

        {loading && (
          <p className="mt-6 text-sm text-gray-400">Loading assignment...</p>
        )}
        {!loading && error && (
          <p className="mt-6 text-sm text-red-400">{error}</p>
        )}
        {!loading && !error && assignment && (
          <section className="mt-6 max-w-3xl">
            <header className="border-b border-gray-800 pb-7 mb-3">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <ClipboardList size={23} strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-indigo-400">
                    Assignment Details
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {assignment.title}
                  </h1>
                </div>
              </div>
            </header>

            <div className="divide-y divide-gray-800 rounded-2xl border border-gray-800 bg-gray-900 px-5">
              <div className="py-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                  {assignment.description}
                </p>
              </div>
              <div className="py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Due date
                </p>
                <p className="mt-2 text-sm text-gray-300">
                  {formatDate(assignment.due_date)} | 11:59 PM
                </p>
              </div>
              {attachmentName && attachmentPath && (
                <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Instructor attachment
                    </p>
                    <p className="mt-2 truncate text-sm text-gray-300">
                      {attachmentName}
                    </p>
                  </div>
                  <a
                    href={`http://localhost:3000${attachmentPath}`}
                    target="_blank"
                    rel="noreferrer"
                    download={attachmentName}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                  >
                    <Download size={16} strokeWidth={1.8} />
                    View / Download
                  </a>
                </div>
              )}
            </div>

            {!submission || editingSubmission ? (
              <form
                className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5"
                onSubmit={handleSubmit}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Upload size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Your response
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Add written work or attach a file for your instructor.
                    </p>
                  </div>
                </div>
                <label className="mt-5 block space-y-1.5 text-sm text-gray-300">
                  Written response
                  <textarea
                    value={response}
                    onChange={(event) => setResponse(event.target.value)}
                    rows={7}
                    placeholder="Write your response here..."
                    className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-indigo-500 mt-2"
                  />
                </label>
                <label className="mt-4 block space-y-1.5 text-sm text-gray-300">
                  Upload file
                  <input
                    type="file"
                    onChange={(event) =>
                      setAttachment(event.target.files?.[0] ?? null)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-400 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-200 hover:file:bg-gray-700 focus:border-indigo-500 mt-2"
                  />
                  {editingSubmission && submission?.attachment_name && (
                    <p className="text-xs text-gray-500">
                      Current file:{" "}
                      {submissionAttachmentPath ? (
                        <a
                          href={`http://localhost:3000${submissionAttachmentPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          {submission.attachment_name}
                        </a>
                      ) : (
                        submission.attachment_name
                      )}
                    </p>
                  )}
                </label>
                {attachment && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected: {attachment.name}
                  </p>
                )}
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                {success && (
                  <p className="mt-3 text-sm text-emerald-400">{success}</p>
                )}

                <div className="mt-4 flex justify-end gap-3">
                  {editingSubmission && (
                    <button
                      type="button"
                      onClick={handleCancelUpdate}
                      disabled={submitting}
                      className="cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? editingSubmission
                        ? "Resubmitting..."
                        : "Submitting..."
                      : editingSubmission
                        ? "Resubmit"
                        : "Submit"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gray-900 p-5">
                {success && (
                  <p className="mb-3 text-sm text-emerald-400">{success}</p>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-emerald-400">
                      Assignment Submitted
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Your response has been recorded.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    disabled={loadingSubmission}
                    className="shrink-0 rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingSubmission ? "Loading..." : "Update Submission"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AssignmentDetails;
