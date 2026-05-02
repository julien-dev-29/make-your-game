export const checkBorderCollision = (player) => {
  const maxX = window.innerWidth - player.$element.offsetWidth;
  const maxY = window.innerHeight - player.$element.offsetHeight;

  if (player.x < 0) player.x = 0;
  if (player.x > maxX) player.x = maxX;
  if (player.y < 0) player.y = 0;
  if (player.y > maxY) player.y = maxY;
};