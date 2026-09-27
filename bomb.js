export function createBomb(coords, level) {
  const { x, y } = coords;
  level[y][x] = 3;
  let count = 4;
  let isDestroy = false;
  let scale = 1;
  let inOut = "in";
  const bombElmt = document.createElement("div");
  bombElmt.classList.add("bomb");
  const getBombElmt = () => bombElmt;
  function destroy() {
    level[y][x] = 4;
    setTimeout(() => {
      level[y][x] = 0;
    }, 1000);
    checkCollisionWithDestructible();
    setDestroyed(true);
  }
  function checkCollisionWithDestructible() {
    if (level[y + 1][x] === 0) {
      level[y + 1][x] = 4;
      setTimeout(() => {
        level[y + 1][x] = 0;
      }, 1000);
      if (level[y + 2][x] === 0) {
        setTimeout(() => {
          level[y + 2][x] = 4;
          setTimeout(() => {
            level[y + 2][x] = 0;
          }, 1000);
        }, 100);
      }
    }
    if (level[y - 1][x] === 0) {
      level[y - 1][x] = 4;
      setTimeout(() => {
        level[y - 1][x] = 0;
      }, 1000);
      if (level[y - 2][x] === 0) {
        setTimeout(() => {
          level[y - 2][x] = 4;
          setTimeout(() => {
            level[y - 2][x] = 0;
          }, 1000);
        }, 100);
      }
    }
    if (level[y][x + 1] === 0) {
      level[y][x + 1] = 4;
      setTimeout(() => {
        level[y][x + 1] = 0;
      }, 1000);
      if (level[y][x + 2] === 0) {
        setTimeout(() => {
          level[y][x + 2] = 4;
          setTimeout(() => {
            level[y][x + 2] = 0;
          }, 1000);
        }, 100);
      }
    }
    if (level[y][x - 1] === 0) {
      level[y][x - 1] = 4;
      setTimeout(() => {
        level[y][x - 1] = 0;
      }, 1000);
      if (level[y][x - 2] === 0) {
        setTimeout(() => {
          level[y][x - 2] = 4;
          setTimeout(() => {
            level[y][x - 2] = 0;
          }, 1000);
        }, 100);
      }
    }
    if (level[y + 1][x] === 2) {
      level[y + 1][x] = 0;
    }
    if (level[y][x + 1] === 2) {
      level[y][x + 1] = 0;
    }
    if (level[y - 1][x] === 2) {
      level[y - 1][x] = 0;
    }
    if (level[y][x - 1] === 2) {
      level[y][x - 1] = 0;
    }
  }
  const isDestroyed = () => isDestroy;
  const setDestroyed = (bool) => (isDestroy = bool);
  function init() {
    const interval = setInterval(() => {
      count = count - 1;
      if (inOut === "in") {
        scale += 0.2;
        inOut = "out";
      } else {
        scale -= 0.2;
        inOut = "in";
      }
      console.log(count);
      if (count <= 0) {
        clearInterval(interval);
        destroy();
      }
    }, 1000);
  }
  init();
  function update() {
    bombElmt.style.transform = `Scale(${scale})`;
  }
  return { x, y, getBombElmt, isDestroyed, update };
}
