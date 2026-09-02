import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Download, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentAssignmentDetails } from "../services/assignmentServices";
import formatDate from "../utils/formatDate";

function AssignmentDetails() {
  const { classId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [response, setResponse] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getStudentAssignmentDetails(classId, assignmentId);
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
                  <p className="mt-1 text-sm text-gray-400">{}</p>
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

            <form className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
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
              </label>
              {attachment && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {attachment.name}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 cursor-pointer">
                  Submit
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default AssignmentDetails;
