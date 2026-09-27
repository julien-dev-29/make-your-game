export function createCell() {
  const elmt = document.createElement("div");
  elmt.classList.add("cell");
  function addPLayer() {
    const playerElmt = document.createElement("div");
    playerElmt.classList.add("player");
    this.elmt.append(playerElmt);
  }
  function addWall() {
    this.elmt.classList.add("wall");
  }
  function addDestructible() {
    this.elmt.classList.add("destructible");
    const brick1 = document.createElement("div");
    brick1.classList.add("brick-1");
    const brick2 = document.createElement("div");
    brick2.classList.add("brick-2");
    const brick3 = document.createElement("div");
    brick3.classList.add("brick-3");
    const brick4 = document.createElement("div");
    brick4.classList.add("brick-4");
    const brick5 = document.createElement("div");
    brick5.classList.add("brick-5");
    this.elmt.append(brick1, brick2, brick3, brick4, brick5);
  }
  function addBomb(bomb) {
    this.elmt.append(bomb.getBombElmt());
  }
  function addFire() {
    const fireElmt = document.createElement("div");
    fireElmt.classList.add("fire");
    this.elmt.append(fireElmt);
  }
  return { elmt, addPLayer, addWall, addDestructible, addBomb, addFire };
}
