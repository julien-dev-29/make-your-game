import { describe, expect, test } from "vitest";
import { createInput } from "./input";

describe("input", () => {
  test("track held keys and consume bomb edge", () => {
    const input = createInput();
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
    expect(input.pressedKeys.has("ArrowLeft")).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowRight" }));
    expect(input.pressedKeys.has("ArrowRight")).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    expect(input.consumeBomb()).toBe(true);
    expect(input.consumeBomb()).toBe(false);
  });
});
