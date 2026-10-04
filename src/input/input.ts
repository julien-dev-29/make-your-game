export function createInput() {
  const pressedKeys = new Set<string>();
  window.addEventListener("keydown", (e) => {
    if (e.code.startsWith("Arrow")) {
      pressedKeys.add(e.code);
      console.log("set", pressedKeys);
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code.startsWith("Arrow")) {
      pressedKeys.delete(e.code);
      console.log(pressedKeys);
    }
  });
  return { pressedKeys };
}
