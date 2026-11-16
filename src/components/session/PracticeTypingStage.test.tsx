import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PracticeTypingStage } from "./PracticeTypingStage";

describe("PracticeTypingStage Component", () => {
  it("кнопка 'Проверить' заблокирована, если поле ввода пустое", () => {
    render(
      <PracticeTypingStage
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onSkip={() => {}}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /проверить/i });
    expect(submitBtn).toBeDisabled();
  });

  it("вызывает onSubmit при отправке формы с заполненным текстом", () => {
    const handleSubmit = vi.fn();

    render(
      <PracticeTypingStage
        value="apple"
        onChange={() => {}}
        onSubmit={handleSubmit}
        onSkip={() => {}}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /проверить/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
