const MOVE_CODE = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function createInput() {
  let bombQueued = false,
    pauseQueued = false,
    confirmQueued = false;
  const pressedKeys = new Set<string>();
  const down = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (MOVE_CODE.has(e.code)) {
      pressedKeys.add(e.code);
    }
    if (e.code === "Space") {
        bombQueued = true
    }
  }
  window.addEventListener("keydown", down);
  return {
    pressedKeys,
    consumeBomb() {
      const b = bombQueued;
      bombQueued = false;
      return b;
    },
    consumePause() {
      const p = pauseQueued;
      pauseQueued = false;
      return p;
    },
    consumeConfirm(){
        const c = confirmQueued
        confirmQueued = false
        return c
    },
    destroy() {
        window.removeEventListener("keydown", down)
    }
  };
}
