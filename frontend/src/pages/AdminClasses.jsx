import { useEffect, useState } from "react";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} from "../services/classServices";
import AdminClassCard from "../components/AdminClassCard";
import ClassModal from "../components/ClassModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const accents = [
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
];

const initialFormData = {
  name: "",
  code: "",
  schedule: "",
  capacity: "30",
  status: "Active",
};

function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [creatingClass, setCreatingClass] = useState(false);
  const [createError, setCreateError] = useState("");
  const [classToDelete, setClassToDelete] = useState(null);
  const [deletingClass, setDeletingClass] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadClasses = async () => {
    const data = await getClasses();
    setClasses(data.classes ?? []);
  };

  useEffect(() => {
    const fetchInitialClasses = async () => {
      try {
        await loadClasses();
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load classes right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialClasses();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const closeClassModal = (force = false) => {
    if (creatingClass && !force) {
      return;
    }

    setClassModalOpen(false);
    setEditingClass(null);
    setCreateError("");
    setFormData(initialFormData);
  };

  const handleCreateClass = async (event) => {
    event.preventDefault();
    setCreatingClass(true);
    setCreateError("");

    try {
      const classData = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      if (editingClass) {
        await updateClass(editingClass.id, classData);
      } else {
        await createClass(classData);
      }
      const data = await getClasses();
      setClasses(data.classes ?? []);
      setCreatingClass(false);
      closeClassModal(true);
    } catch (requestError) {
      setCreateError(
        requestError.response?.data?.message ||
          "Unable to create this class right now.",
      );
    } finally {
      setCreatingClass(false);
    }
  };

  const handleEditClass = (selectedClass) => {
    setEditingClass(selectedClass);
    setFormData({
      name: selectedClass.name ?? "",
      code: selectedClass.code ?? "",
      schedule: selectedClass.schedule ?? "",
      capacity: String(selectedClass.capacity ?? ""),
      status: selectedClass.status ?? "Active",
    });
    setCreateError("");
    setClassModalOpen(true);
  };

  const requestDeleteClass = (selectedClass) => {
    setClassToDelete(selectedClass);
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    if (deletingClass) {
      return;
    }

    setClassToDelete(null);
    setDeleteError("");
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) {
      return;
    }

    setDeletingClass(true);
    setDeleteError("");
    setLoading(true);
    setError("");

    try {
      await deleteClass(classToDelete.id);
      await loadClasses();
      setClassToDelete(null);
      setDeleteError("");
    } catch (requestError) {
      setDeleteError(
        requestError.response?.data?.message ||
          "Unable to delete this class right now.",
      );
    } finally {
      setDeletingClass(false);
      setLoading(false);
    }
  };

  const totalStudents = classes.reduce(
    (total, classItem) =>
      total + (classItem.students ?? classItem.enrolledStudents ?? 0),
    0,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <main className="relative px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-gray-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Classes
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage class schedules, teachers, and enrollment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCreateError("");
              setEditingClass(null);
              setFormData(initialFormData);
              setClassModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:bg-indigo-700"
          >
            Create class
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4 border-b border-gray-800 py-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total classes
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {classes.length}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Enrolled students
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {totalStudents}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Active classes
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {
                classes.filter((classItem) => classItem.status === "Active")
                  .length
              }
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 py-8 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <p className="text-sm text-gray-400">Loading classes...</p>
          )}

          {!loading && error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && classes.length === 0 && (
            <p className="text-sm text-gray-400">
              No classes have been created yet.
            </p>
          )}

          {!loading &&
            !error &&
            classes.map((classItem, index) => (
              <AdminClassCard
                key={classItem.id ?? classItem.code}
                onEdit={handleEditClass}
                onDelete={requestDeleteClass}
                classItem={{
                  ...classItem,
                  accent: accents[index % accents.length],
                }}
              />
            ))}
        </section>
      </main>
      <ClassModal
        isOpen={classModalOpen}
        formData={formData}
        loading={creatingClass}
        error={createError}
        isEditing={Boolean(editingClass)}
        onChange={handleFormChange}
        onClose={closeClassModal}
        onSubmit={handleCreateClass}
      />
      <ConfirmDeleteModal
        isOpen={Boolean(classToDelete)}
        className={classToDelete?.name}
        loading={deletingClass}
        error={deleteError}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteClass}
      />
    </div>
  );
}

export default AdminClasses;
