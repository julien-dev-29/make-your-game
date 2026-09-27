export function createInputs() {
  const pressed = new Set();
  const isArrowInput = (e) =>
    e.key === " " ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight";

  function init() {
    window.addEventListener("keydown", (e) => {
      if (isArrowInput(e)) {
        pressed.add(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      if (isArrowInput(e)) {
        pressed.delete(e.key);
      }
    });
  }
  return { init, pressed };
}
