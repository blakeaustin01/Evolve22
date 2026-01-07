export function createTopDownIsland() {
  const player = {
    x: 100,
    y: 100,
    size: 20,
    speed: 200
  };

  const exit = {
    x: 700,
    y: 500,
    size: 30
  };

  const walls = [
    { x: 200, y: 150, w: 300, h: 20 },
    { x: 200, y: 150, w: 20, h: 300 },
    { x: 400, y: 300, w: 300, h: 20 }
  ];

  const keys = {};
  let isComplete = false;
  let result = null;

  window.addEventListener("keydown", e => (keys[e.key] = true));
  window.addEventListener("keyup", e => (keys[e.key] = false));

  function update(delta) {
    if (isComplete) return;

    let dx = 0;
    let dy = 0;

    if (keys["ArrowUp"] || keys["w"]) dy -= 1;
    if (keys["ArrowDown"] || keys["s"]) dy += 1;
    if (keys["ArrowLeft"] || keys["a"]) dx -= 1;
    if (keys["ArrowRight"] || keys["d"]) dx += 1;

    const nx = player.x + dx * player.speed * delta;
    const ny = player.y + dy * player.speed * delta;

    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;

    if (rectIntersect(player, exit)) {
      isComplete = true;
      result = {
        outcome: "success",
        time: performance.now(),
        collected: [],
        islandType: "top_down"
      };
    }
  }

  function collides(x, y) {
    const test = { x, y, size: player.size };
    return walls.some(w => rectIntersect(test, w));
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
    ctx.clearRect(0, 0, 800, 600);

    // Walls
    ctx.fillStyle = "#444";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

    // Exit
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);

    // Player
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Goal text
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

