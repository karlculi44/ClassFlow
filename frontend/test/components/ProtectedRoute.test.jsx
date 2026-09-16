import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import ProtectedRoute from "../../src/components/ProtectedRoute";

const renderRoute = (authValue, allowedRoles = ["Student"]) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <h1>Protected content</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<h1>Unauthorized page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe("ProtectedRoute", () => {
  it("shows loading while authentication is being resolved", () => {
    renderRoute({ loading: true, user: null });

    expect(
      screen.getByRole("status", { name: "Loading page" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["without a user", { loading: false, user: null }],
    ["for a disallowed role", { loading: false, user: { role: "Admin" } }],
  ])("redirects %s", (_, authValue) => {
    renderRoute(authValue);

    expect(
      screen.getByRole("heading", { name: "Unauthorized page" }),
    ).toBeInTheDocument();
  });

  it("renders children for an allowed role", () => {
    renderRoute({ loading: false, user: { role: "Student" } });

    expect(
      screen.getByRole("heading", { name: "Protected content" }),
    ).toBeInTheDocument();
  });
});
