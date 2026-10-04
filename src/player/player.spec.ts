import { describe, expect, test } from "vitest";
import { Player } from "./player";
import { createInput } from "../input/input";

describe("create a player", () => {
  const inputs = createInput();
  test("return the name of the player", () => {
    const player = new Player("Jurol", { x: 0, y: 0 }, inputs.pressedKeys);
    const player2 = new Player("Kiki", { x: 0, y: 0 }, inputs.pressedKeys);
    const player3 = new Player("Toto", { x: 0, y: 0 }, inputs.pressedKeys);

    expect(player.name).toBe("Jurol");
    expect(player2.name).toBe("Kiki");
    expect(player3.name).toBe("Toto");
  });

  test("return the position of the player", () => {
    const player = new Player("Jurol", { x: 0, y: 0 }, inputs.pressedKeys);
    const player2 = new Player("Kiki", { x: 2, y: 2 }, inputs.pressedKeys);
    const player3 = new Player("Toto", { x: 5, y: 8 }, inputs.pressedKeys);

    expect(player.position.x).toBe(0);
    expect(player.position.y).toBe(0);
    expect(player2.position.x).toBe(2);
    expect(player2.position.y).toBe(2);
    expect(player3.position.x).toBe(5);
    expect(player3.position.y).toBe(8);
  });

  test("update the player", () => {
    const player = new Player("Jurol", {x: 0, y: 0}, inputs.pressedKeys)
    inputs.pressedKeys.add("ArrowLeft")
    player.update()
    inputs.pressedKeys.delete("ArrowLeft")
    expect(player.position.x).toBe(1)
    inputs.pressedKeys.add("ArrowRight")
    player.update()
    expect(player.position.y).toBe(1)
  })
});
