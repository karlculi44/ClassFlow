import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import Dashboard from "../../src/pages/Dashboard";

const getStudentEnrollments = vi.hoisted(() => vi.fn());
const getAssignments = vi.hoisted(() => vi.fn());
vi.mock("../../src/services/enrollmentServices", () => ({ getStudentEnrollments }));
vi.mock("../../src/services/assignmentServices", () => ({ getAssignments }));

const renderDashboard = () => render(
  <AuthContext.Provider value={{ user: { name: "Ada" } }}>
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  </AuthContext.Provider>,
);

describe("Dashboard", () => {
  it("loads classes and assignment statistics into the student workspace", async () => {
    getStudentEnrollments.mockResolvedValueOnce({ classes: [{
      id: 1,
      name: "Mathematics",
      code: "M101",
      schedule_days: ["Monday"],
      schedule_start_time: "09:00",
      schedule_end_time: "10:00",
    }] });
    getAssignments.mockResolvedValueOnce({ assignments: [
      { id: 1, title: "Quiz", submission_id: null, grade: null },
      { id: 2, title: "Essay", submission_id: 5, grade: 90 },
    ] });

    renderDashboard();

    expect(await screen.findByText("Welcome back, Ada")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Enrolled Classes")).toBeInTheDocument();
    expect(screen.getByText("Pending Assignments")).toBeInTheDocument();
  });

  it("shows the API error when dashboard data cannot load", async () => {
    getStudentEnrollments.mockRejectedValueOnce({
      response: { data: { message: "Dashboard unavailable" } },
    });
    getAssignments.mockResolvedValueOnce({ assignments: [] });

    renderDashboard();

    expect(await screen.findByText("Dashboard unavailable")).toBeInTheDocument();
  });
});
