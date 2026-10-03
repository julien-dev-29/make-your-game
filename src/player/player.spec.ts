import { describe, expect, test } from "vitest";
import { Player } from "./player";

describe("create a player", () => {
  test("return the name of the player", () => {
    const player = new Player("Jurol", { x: 0, y: 0 });
    const player2 = new Player("Kiki", { x: 0, y: 0 });
    const player3 = new Player("Toto", { x: 0, y: 0 });

    expect(player.name).toBe("Jurol");
    expect(player2.name).toBe("Kiki");
    expect(player3.name).toBe("Toto");
  });

  test("return the position of the player", () => {
    const player = new Player("Jurol", { x: 0, y: 0 });
    const player2 = new Player("Kiki", { x: 2, y: 2 });
    const player3 = new Player("Toto", { x: 5, y: 8 });

    expect(player.position.x).toBe(0);
    expect(player.position.y).toBe(0);
    expect(player2.position.x).toBe(2);
    expect(player2.position.y).toBe(2);
    expect(player3.position.x).toBe(5);
    expect(player3.position.y).toBe(8);
  });
});
