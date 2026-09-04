import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  MoreVertical,
  Pencil,
  Plus,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { getClasses } from "../services/classServices";
import {
  createAssignment,
  deleteAssignment,
  getAdminAssignments,
  updateAssignment,
} from "../services/assignmentServices";
import CreateAssignmentModal from "../components/CreateAssignmentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AddStudentModal from "../components/AddStudentModal";
import { getStudents } from "../services/userServices";
import {
  addStudents,
  getEnrolledStudents,
} from "../services/enrollmentServices";
import { getAdminSubmissions } from "../services/submissionServices";
import { formatSchedule, isScheduleActive } from "../utils/schedule";

const initialAssignmentFormData = {
  title: "",
  description: "",
  dueDate: "",
  attachment: null,
};

function ClassWorkspace() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState(
    initialAssignmentFormData,
  );
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [createAssignmentError, setCreateAssignmentError] = useState("");
  const [openAssignmentMenu, setOpenAssignmentMenu] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(false);
  const [deleteAssignmentError, setDeleteAssignmentError] = useState("");
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [addingStudents, setAddingStudents] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [enrolledStudentsError, setEnrolledStudentsError] = useState("");
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data.classes ?? []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load this class right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();

    const fetchAssignments = async () => {
      try {
        const data = await getAdminAssignments(classId);
        const assignmentsWithSubmissions = await Promise.all(
          (data.data ?? []).map(async (assignment) => {
            const submissionData = await getAdminSubmissions(
              classId,
              assignment.id,
            );

            return {
              ...assignment,
              submissions: submissionData.assignment.submitted_count,
              totalStudents: submissionData.assignment.total_students,
            };
          }),
        );
        setAssignments(assignmentsWithSubmissions);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load assignments right now.",
        );
      }
    };

    fetchAssignments();

    const fetchEnrolledStudents = async () => {
      try {
        const data = await getEnrolledStudents(classId);
        setEnrolledStudents(data.students ?? []);
      } catch (requestError) {
        setEnrolledStudentsError(
          requestError.response?.data?.message ||
            "Unable to load enrolled students right now.",
        );
      }
    };

    fetchEnrolledStudents();
  }, [classId]);

  const classItem = useMemo(
    () => classes.find((item) => String(item.id) === String(classId)),
    [classes, classId],
  );

  const students = classItem
    ? enrolledStudents.length > 0
      ? enrolledStudents.length
      : (classItem.students ?? classItem.enrolledStudents ?? 0)
    : 0;
  const status = isScheduleActive(classItem, currentTime)
    ? "Active"
    : "Inactive";
  const statusClassName =
    status === "Active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : "border-gray-500/20 bg-gray-500/10 text-gray-400";

  const closeAssignmentModal = () => {
    if (creatingAssignment) {
      return;
    }

    setAssignmentModalOpen(false);
    setEditingAssignment(null);
    setAssignmentFormData(initialAssignmentFormData);
    setCreateAssignmentError("");
  };

  const handleAssignmentFormChange = (event) => {
    const { name, value } = event.target;
    setAssignmentFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleAssignmentFileChange = (event) => {
    setAssignmentFormData((currentFormData) => ({
      ...currentFormData,
      attachment: event.target.files?.[0] ?? null,
    }));
  };

  const handleCreateAssignment = async (event) => {
    event.preventDefault();
    setCreatingAssignment(true);
    setCreateAssignmentError("");

    try {
      const payload = new FormData();
      payload.append("title", assignmentFormData.title);
      payload.append("description", assignmentFormData.description);
      payload.append("dueDate", assignmentFormData.dueDate);
      if (assignmentFormData.attachment) {
        payload.append("attachment", assignmentFormData.attachment);
      }

      if (editingAssignment) {
        await updateAssignment(classId, editingAssignment.id, payload);
      } else {
        await createAssignment(classId, payload);
      }

      const data = await getAdminAssignments(classId);
      setAssignments(data.data ?? []);
      closeAssignmentModal();
    } catch (requestError) {
      setCreateAssignmentError(
        requestError.response?.data?.message ||
          "Unable to save this assignment right now.",
      );
    } finally {
      setCreatingAssignment(false);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentFormData({
      title: assignment.title ?? "",
      description: assignment.description ?? "",
      dueDate: String(assignment.due_date ?? assignment.dueDate ?? "").slice(
        0,
        10,
      ),
      attachment: null,
    });
    setCreateAssignmentError("");
    setOpenAssignmentMenu(null);
    setAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) {
      return;
    }

    setDeletingAssignment(true);
    setDeleteAssignmentError("");

    try {
      await deleteAssignment(classId, assignmentToDelete.id);
      setAssignments((currentAssignments) =>
        currentAssignments.filter(
          (assignment) => assignment.id !== assignmentToDelete.id,
        ),
      );
      setAssignmentToDelete(null);
    } catch (requestError) {
      setDeleteAssignmentError(
        requestError.response?.data?.message ||
          "Unable to delete this assignment right now.",
      );
    } finally {
      setDeletingAssignment(false);
    }
  };

  const handleOpenStudentModal = async () => {
    setStudentModalOpen(true);
    setStudentsLoading(true);
    setStudentsError("");

    try {
      const data = await getStudents();
      setStudentsList(data.students ?? []);
    } catch (requestError) {
      setStudentsError(
        requestError.response?.data?.message ||
          "Unable to load students right now.",
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAddStudents = async (studentIds) => {
    setAddingStudents(true);
    setStudentsError("");

    try {
      await addStudents(classId, studentIds);
      const data = await getEnrolledStudents(classId);
      setEnrolledStudents(data.students ?? []);
      setStudentModalOpen(false);
    } catch (requestError) {
      setStudentsError(
        requestError.response?.data?.message ||
          "Unable to add students right now.",
      );
    } finally {
      setAddingStudents(false);
    }
  };

  const enrolledStudentIds = new Set(
    enrolledStudents.map((student) => String(student.id)),
  );
  const availableStudents = studentsList.filter(
    (student) => !enrolledStudentIds.has(String(student.id)),
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/admin-classes")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to classes
        </button>

        {loading && (
          <p className="mt-6 text-sm text-gray-400">Loading class...</p>
        )}

        {!loading && error && (
          <p className="mt-6 text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && !classItem && (
          <p className="mt-6 text-sm text-gray-400">
            This class could not be found.
          </p>
        )}

        {!loading && !error && classItem && (
          <>
            {/* Class header */}
            <header className="mt-6 flex flex-col gap-5 border-b border-gray-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {classItem.code}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {classItem.name}
                  </h1>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassName}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} strokeWidth={1.8} />
                    {formatSchedule(classItem)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={15} strokeWidth={1.8} />
                    {students} / {classItem.capacity} students
                  </span>
                </div>
              </div>
            </header>

            {/* Quick actions */}
            <section className="flex flex-wrap gap-3 border-b border-gray-800 py-6">
              <button
                type="button"
                onClick={() => setAssignmentModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700"
              >
                <Plus size={16} strokeWidth={1.8} />
                Create assignment
              </button>
              <button
                type="button"
                onClick={handleOpenStudentModal}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
              >
                <UserPlus size={16} strokeWidth={1.8} />
                Add student
              </button>
            </section>

            <div className="grid grid-cols-1 gap-8 py-8 xl:grid-cols-2">
              {/* Students list */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Students</h2>
                  <span className="text-sm text-gray-500">
                    {students} / {classItem.capacity}
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudentsError ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-6 text-center text-sm text-red-400"
                          >
                            {enrolledStudentsError}
                          </td>
                        </tr>
                      ) : enrolledStudents.length > 0 ? (
                        enrolledStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-gray-800 last:border-b-0"
                          >
                            <td className="px-4 py-3 text-gray-200">
                              {student.name}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {student.email}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                aria-label={student.status}
                                title={student.status}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${student.status === "Online" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-gray-700 bg-gray-800 text-gray-400"}`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${student.status === "Online" ? "bg-emerald-400" : "bg-gray-400"}`}
                                  aria-hidden="true"
                                />
                                <span className="sr-only">
                                  {student.status}
                                </span>
                                <span className="hidden sm:inline">
                                  {student.status}
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No students enrolled yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Assignments list */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Assignments
                  </h2>
                </div>
                {assignments.length === 0 ? (
                  <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-800 bg-gray-900 px-4 py-10 text-center">
                    <ClipboardList
                      size={22}
                      strokeWidth={1.6}
                      className="text-gray-600"
                    />
                    <p className="text-sm text-gray-500">
                      No assignments created yet.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {assignments.map((assignment) => {
                      const submitted = assignment.submissions ?? 0;
                      const total = assignment.totalStudents ?? students;
                      const submissionPercent = total
                        ? Math.min(100, Math.round((submitted / total) * 100))
                        : 0;

                      return (
                        <li className="relative" key={assignment.id}>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin-classes/${classId}/assignments/${assignment.id}`,
                              )
                            }
                            className="flex w-full items-start gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4 pr-12 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/60 hover:bg-gray-800/60 cursor-pointer"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                              <ClipboardList size={18} strokeWidth={1.8} />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {assignment.title}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {submitted}/{total} submitted
                              </p>
                              <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-800">
                                <div
                                  className="h-full rounded-full bg-indigo-500"
                                  style={{ width: `${submissionPercent}%` }}
                                />
                              </div>
                            </div>
                          </button>
                          <div className="absolute right-2 top-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenAssignmentMenu((openAssignmentId) =>
                                  openAssignmentId === assignment.id
                                    ? null
                                    : assignment.id,
                                );
                              }}
                              aria-label={`More options for ${assignment.title}`}
                              aria-expanded={
                                openAssignmentMenu === assignment.id
                              }
                              title="More options"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            >
                              <MoreVertical size={17} strokeWidth={1.8} />
                            </button>

                            {openAssignmentMenu === assignment.id && (
                              <div
                                onClick={(event) => event.stopPropagation()}
                                className="absolute right-0 top-11 z-10 w-44 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-xl shadow-black/40"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditAssignment(assignment)
                                  }
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-indigo-500/10 hover:text-indigo-300"
                                >
                                  <Pencil size={15} strokeWidth={1.8} />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenAssignmentMenu(null);
                                    setDeleteAssignmentError("");
                                    setAssignmentToDelete(assignment);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <Trash size={15} strokeWidth={1.8} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <CreateAssignmentModal
        isOpen={assignmentModalOpen}
        formData={assignmentFormData}
        loading={creatingAssignment}
        error={createAssignmentError}
        isEditing={Boolean(editingAssignment)}
        existingAttachmentName={editingAssignment?.attachment_name}
        onChange={handleAssignmentFormChange}
        onFileChange={handleAssignmentFileChange}
        onClose={closeAssignmentModal}
        onSubmit={handleCreateAssignment}
      />
      <ConfirmDeleteModal
        isOpen={Boolean(assignmentToDelete)}
        className={assignmentToDelete?.title}
        itemLabel="assignment"
        loading={deletingAssignment}
        error={deleteAssignmentError}
        onClose={() => {
          if (!deletingAssignment) {
            setAssignmentToDelete(null);
            setDeleteAssignmentError("");
          }
        }}
        onConfirm={handleDeleteAssignment}
      />
      <AddStudentModal
        key={studentModalOpen ? "student-modal-open" : "student-modal-closed"}
        isOpen={studentModalOpen}
        students={availableStudents}
        loading={studentsLoading}
        saving={addingStudents}
        error={studentsError}
        onClose={() => {
          if (!studentsLoading) {
            setStudentModalOpen(false);
          }
        }}
        onAdd={handleAddStudents}
      />
    </div>
  );
}

export default ClassWorkspace;
