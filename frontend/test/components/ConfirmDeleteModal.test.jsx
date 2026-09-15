import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDeleteModal from "../../src/components/ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("does not render when closed", () => {
    render(<ConfirmDeleteModal isOpen={false} className="Algebra" />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("requires the exact confirmation text before confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteModal
        isOpen
        className="Algebra"
        itemLabel="class"
        onConfirm={onConfirm}
        onClose={vi.fn()}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Delete class" });
    expect(confirmButton).toBeDisabled();

    const input = screen.getByRole("textbox", {
      name: "Type delete Algebra to confirm deletion",
    });
    await user.type(input, "delete algebra");
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, "delete Algebra");
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
