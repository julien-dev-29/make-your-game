import { describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { renderGameboard } from "./renderGameboard";
import { level1 } from "../level/level1";
import "../style.css";

describe("renderGameboard tests", () => {
  test("yolo", async () => {
    const gameboard = renderGameboard(level1);
    document.body.append(gameboard);

    await expect.element(page.getByTestId("cell-1")).toBeInTheDocument();
  });
});
