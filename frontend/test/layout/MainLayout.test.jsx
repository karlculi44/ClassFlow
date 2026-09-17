import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import MainLayout from "../../src/layout/MainLayout";

vi.mock("../../src/components/Sidebar", () => ({
  default: () => <nav>Protected navigation</nav>,
}));

const renderLayout = (authValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe("MainLayout", () => {
  it("keeps protected layout content hidden while auth is loading", () => {
    renderLayout({ loading: true, user: null });

    expect(
      screen.getByRole("status", { name: "Loading page" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected navigation")).not.toBeInTheDocument();
  });

  it("renders the protected layout after auth resolves", () => {
    renderLayout({ loading: false, user: { role: "Admin" } });

    expect(screen.getByText("Protected navigation")).toBeInTheDocument();
  });
});
