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

    const nextX = player.x + dx * player.speed * delta;
    const nextY = player.y + dy * player.speed * delta;

    if (!collides(nextX, player.y)) player.x = nextX;
    if (!collides(player.x, nextY)) player.y = nextY;

    if (rectIntersect(player, exit)) {
      isComplete = true;
      result = {
        islandType: "top_down",
        outcome: "success",
        duration: Math.round(performance.now() - startTime),
        theme: config.theme || "neutral"
      };
    }
  }

  function collides(x, y) {
    const box = { x, y, size: player.size };
    return walls.some(w => rectIntersect(box, w));
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
    // background
    ctx.fillStyle =
      config.theme === "danger" ? "#2a0000" :
      config.theme === "mystery" ? "#00002a" :
      "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // walls
    ctx.fillStyle =
      config.theme === "danger" ? "#aa3333" :
      config.theme === "mystery" ? "#3333aa" :
      "#444";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

    // exit
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);

    // player
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // UI
    ctx.fillStyle = "#aaa";
    ctx.font = "16px monospace";
    ctx.fillText("Reach the glowing square", 20, 30);
  }

  return {
    update,
    draw,
    get isComplete() {
      return isComplete;
    },
    get result() {
      return result;
    }
  };
}
