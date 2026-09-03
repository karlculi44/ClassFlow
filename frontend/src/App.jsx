import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminClasses from "./pages/AdminClasses";
import AdminClassWorkspace from "./pages/AdminClassWorkspace";
import AdminAssignmentDetails from "./pages/AdminAssignmentDetails";
import AssignmentDetails from "./pages/AssignmentDetails";
import Assignments from "./pages/Assignments";
import MainLayout from "./layout/MainLayout";
import Submissions from "./pages/Submissions";
import Classes from "./components/Classes";
import StudentClassWorkspace from "./pages/StudentClassWorkspace";
import Grades from "./pages/Grades";

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
              path="/classes"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <Classes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes/:classId"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentClassWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grades"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <Grades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/:assignmentId/class/:classId"
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
                  <AdminClassWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-classes/:classId/assignments/:assignmentId"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminAssignmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-classes/:classId/assignments/:assignmentId/submissions"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <Submissions />
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
