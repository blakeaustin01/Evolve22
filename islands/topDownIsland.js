export function createTopDownIsland(config = {}) {
  const difficulty = config.difficulty || 1;

  const player = {
    x: 40,
    y: 40,
    size: 20,
    speed: 240 - difficulty * 10
  };

  const exit = {
    x: 700,
    y: 500,
    size: 30
  };

  const wallCount = Math.min(3 + difficulty, 10);
  const walls = [];

  for (let i = 0; i < wallCount; i++) {
    walls.push({
      x: 150 + i * 40,
      y: 120 + (i % 3) * 80,
      w: 20,
      h: 200
    });
  }

  const keys = {};
  let isComplete = false;
  let result = null;
  const startTime = performance.now();

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  function update(dt) {
    if (isComplete) return;

    let dx = 0, dy = 0;
    if (keys["w"] || keys["ArrowUp"]) dy -= 1;
    if (keys["s"] || keys["ArrowDown"]) dy += 1;
    if (keys["a"] || keys["ArrowLeft"]) dx -= 1;
    if (keys["d"] || keys["ArrowRight"]) dx += 1;

    const nx = player.x + dx * player.speed * dt;
    const ny = player.y + dy * player.speed * dt;

    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;

    if (rect(player, exit)) {
      isComplete = true;
      result = {
        islandType: "top_down",
        outcome: "success",
        duration: Math.round(performance.now() - startTime)
      };
    }
  }

  function collides(x, y) {
    return walls.some(w => rect({ x, y, size: player.size }, w));
  }

  function rect(a, b) {
    return (
      a.x < b.x + (b.w || b.size) &&
      a.x + a.size > b.x &&
      a.y < b.y + (b.h || b.size) &&
      a.y + a.size > b.y
    );
  }

  function draw(ctx) {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = "#444";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);

    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "#aaa";
    ctx.font = "16px monospace";
    ctx.fillText(`Top-Down Island | Difficulty ${difficulty}`, 20, 30);
  }

  return {
    update,
    draw,
    get isComplete() { return isComplete; },
    get result() { return result; }
  };
}
