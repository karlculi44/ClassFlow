import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminClasses from "./pages/AdminClasses";
import ClassWorkspace from "./pages/ClassWorkspace";
import AdminAssignmentDetails from "./pages/AdminAssignmentDetails";
import AssignmentDetails from "./pages/AssignmentDetails";
import Assignments from "./pages/Assignments";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/:classId/:assignmentId"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <AssignmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-classes"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-classes/:classId"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <ClassWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:classId/assignments/:assignmentId"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminAssignmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:classId/assignments/:assignmentId/submissions"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <div className="min-h-screen bg-gray-950 px-4 py-8 text-sm text-gray-400 sm:px-6 lg:px-10">
                    Submissions page coming soon.
                  </div>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
