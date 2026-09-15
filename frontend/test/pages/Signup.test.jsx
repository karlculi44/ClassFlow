import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Signup from "../../src/pages/Signup";

const registerMock = vi.hoisted(() => vi.fn());
vi.mock("../../src/services/authServices", () => ({ register: registerMock }));

const renderSignup = () => render(
  <MemoryRouter>
    <Signup />
  </MemoryRouter>,
);

const fillForm = async (user, values) => {
  await user.type(screen.getByRole("textbox", { name: "Full name" }), values.name);
  await user.type(screen.getByRole("textbox", { name: "Email" }), values.email);
  await user.type(screen.getByLabelText("Password", { selector: "input" }), values.password);
  await user.type(screen.getByLabelText("Confirm password", { selector: "input" }), values.confirmPassword);
};

describe("Signup", () => {
  it("shows client validation and avoids a request", async () => {
    const user = userEvent.setup();
    renderSignup();

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Full name is required.");
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("submits normalized data and shows the loading state", async () => {
    const user = userEvent.setup();
    registerMock.mockReturnValueOnce(new Promise(() => {}));
    renderSignup();

    await fillForm(user, {
      name: " Ada Lovelace ",
      email: " ADA@EXAMPLE.COM ",
      password: "secret123",
      confirmPassword: "secret123",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(registerMock).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });
    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();
  });

  it("shows an API error", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce({
      response: { data: { message: "Email is already taken" } },
    });
    renderSignup();

    await fillForm(user, {
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
      confirmPassword: "secret123",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email is already taken");
  });
});
