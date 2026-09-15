import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext, AuthProvider } from "../../src/context/AuthContext";

const serviceMocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  googleLogin: vi.fn(),
  getMe: vi.fn(),
}));
vi.mock("../../src/services/authServices", () => ({
  login: serviceMocks.login,
  logout: serviceMocks.logout,
  googleLogin: serviceMocks.googleLogin,
  getMe: serviceMocks.getMe,
}));

function Consumer() {
  const { user, loading, login, logout } = React.useContext(AuthContext);
  return (
    <div>
      <p data-testid="state">{loading ? "loading" : user?.name || "signed out"}</p>
      <button onClick={() => login({ email: "ada@example.com", password: "secret123" })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

import React from "react";

const renderProvider = () => render(
  <AuthProvider>
    <Consumer />
  </AuthProvider>,
);

beforeEach(() => {
  vi.clearAllMocks();
  serviceMocks.getMe.mockResolvedValue({ user: { id: 1, name: "Ada", role: "Student" } });
  serviceMocks.login.mockResolvedValue({});
  serviceMocks.logout.mockResolvedValue({});
});

describe("AuthProvider", () => {
  it("hydrates the current user and clears its loading state", async () => {
    renderProvider();

    expect(screen.getByTestId("state")).toHaveTextContent("loading");
    expect(await screen.findByTestId("state")).toHaveTextContent("Ada");
    expect(serviceMocks.getMe).toHaveBeenCalledOnce();
  });

  it("treats a failed session lookup as signed out", async () => {
    serviceMocks.getMe.mockRejectedValueOnce(new Error("not authenticated"));
    renderProvider();

    expect(await screen.findByTestId("state")).toHaveTextContent("signed out");
  });

  it("logs in, reloads the user, and updates context state", async () => {
    const user = userEvent.setup();
    renderProvider();
    await screen.findByText("Ada");
    serviceMocks.getMe.mockResolvedValueOnce({ user: { id: 2, name: "Grace", role: "Admin" } });

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(serviceMocks.login).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "secret123",
    });
    expect(await screen.findByTestId("state")).toHaveTextContent("Grace");
  });

  it("clears the user after logout", async () => {
    const user = userEvent.setup();
    renderProvider();
    await screen.findByText("Ada");

    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(serviceMocks.logout).toHaveBeenCalledOnce();
    expect(screen.getByTestId("state")).toHaveTextContent("signed out");
  });
});
