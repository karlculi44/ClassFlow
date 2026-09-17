import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import { ThemeContext } from "../../src/context/themeContext";
import Login from "../../src/pages/Login";

const renderLogin = (login) =>
  render(
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: vi.fn() }}>
      <AuthContext.Provider value={{ login, googleLogin: vi.fn() }}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<h1>Admin dashboard</h1>} />
            <Route path="/dashboard" element={<h1>Student dashboard</h1>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeContext.Provider>,
  );

const fillLogin = async (user) => {
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Password"), "secret123");
};

describe("Login", () => {
  it("navigates an admin to the admin dashboard", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue({ role: "Admin" });
    renderLogin(login);

    await fillLogin(user);
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(login).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "secret123",
    });
    expect(
      await screen.findByRole("heading", { name: "Admin dashboard" }),
    ).toBeInTheDocument();
  });

  it("navigates a student to the student dashboard", async () => {
    const user = userEvent.setup();
    renderLogin(vi.fn().mockResolvedValue({ role: "Student" }));

    await fillLogin(user);
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByRole("heading", { name: "Student dashboard" }),
    ).toBeInTheDocument();
  });

  it("shows a user-facing error when login fails", async () => {
    const user = userEvent.setup();
    renderLogin(vi.fn().mockRejectedValue(new Error("invalid credentials")));

    await fillLogin(user);
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid credentials. Please check your email and password.",
    );
  });

  it("shows the rate limit error when login attempts are limited", async () => {
    const user = userEvent.setup();
    renderLogin(
      vi.fn().mockRejectedValue({
        response: {
          status: 429,
          data: { message: "Too many login attempts. Please try again." },
        },
      }),
    );

    await fillLogin(user);
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many login attempts. Please try again.",
    );
  });

  it("shows a spinner and prevents duplicate login requests", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockReturnValue(new Promise(() => {}));
    renderLogin(login);

    await fillLogin(user);
    const button = screen.getByRole("button", { name: "Sign In" });
    await user.click(button);
    await user.click(button);

    expect(login).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Signing in" })).toBeDisabled();
    expect(
      screen.getByRole("status", { name: "Signing in" }),
    ).toBeInTheDocument();
  });
});
