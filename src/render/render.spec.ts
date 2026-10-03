import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "./render";

test("yolo", async () => {
  render();
  await expect.element(page.getByText("Yolo les kikis")).toBeInTheDocument();
});
