export function createTopDownIsland(config = {}) {
  const WIDTH = 800;
  const HEIGHT = 600;

  const player = {
    x: 50,
    y: 50,
    size: 20,
    speed: config.playerSpeed || 200
  };

  const exit = {
    x: config.exitPosition?.x ?? 700,
    y: config.exitPosition?.y ?? 500,
    size: 30
  };

  const walls = config.walls || [
    { x: 200, y: 150, w: 300, h: 20 },
    { x: 200, y: 150, w: 20, h: 300 },
    { x: 400, y: 300, w: 300, h: 20 }
  ];

  const keys = {};
  let isComplete = false;
  let result = null;
  const startTime = performance.now();

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  function update(delta) {
    if (isComplete) return;

    let dx = 0;
    let dy = 0;
    if (keys["w"] || keys["ArrowUp"]) dy -= 1;
    if (keys["s"] || keys["ArrowDown"]) dy += 1;
    if (keys["a"] || keys["ArrowLeft"]) dx -= 1;
    if (keys["d"] || keys["ArrowRight"]) dx += 1;

    const nx = player.x + dx * player.speed * delta;
    const ny = player.y + dy * player.speed * delta;

    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;

    if (rectIntersect(player, exit)) {
      isComplete = true;
      result = {
        islandType: "top_down",
        outcome: "success",
        duration: Math.round(performance.now() - startTime)
      };
    }
  }

  function collides(x, y) {
    return walls.some(w =>
      rectIntersect({ x, y, size: player.size }, w)
    );
  }

  function rectIntersect(a, b) {
    return (
      a.x < b.x + (b.w || b.size) &&
      a.x + a.size > b.x &&
      a.y < b.y + (b.h || b.size) &&
      a.y + a.size > b.y
    );
  }

  function draw(ctx) {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#444";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);

    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "#aaa";
    ctx.font = "16px monospace";
    ctx.fillText("Reach the glowing square", 20, 30);
  }

  return {
    update,
    draw,
    get isComplete() { return isComplete; },
    get result() { return result; }
  };
}
