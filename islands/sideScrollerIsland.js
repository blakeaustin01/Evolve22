export function createSideScrollerIsland(config = {}) {
  const WIDTH = 800;
  const HEIGHT = 600;
  const GROUND_Y = 520;
  const GRAVITY = config.gravity || 1800;

  const player = {
    x: 50,
    y: GROUND_Y - 30,
    w: 25,
    h: 30,
    vx: 0,
    vy: 0,
    speed: config.speed || 300,
    jumpStrength: config.jumpStrength || 650,
    grounded: false
  };

  const platforms = config.platforms || [
    { x: 0, y: GROUND_Y, w: 2000, h: 80 },
    { x: 300, y: 420, w: 120, h: 20 },
    { x: 520, y: 360, w: 120, h: 20 },
    { x: 760, y: 300, w: 120, h: 20 }
  ];

  const exit = {
    x: 1500,
    y: GROUND_Y - 40,
    w: 30,
    h: 40
  };

  const keys = {};
  let cameraX = 0;
  let isComplete = false;
  let result = null;
  const startTime = performance.now();

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  function update(delta) {
    if (isComplete) return;

    // Horizontal movement
    player.vx = 0;
    if (keys["a"] || keys["ArrowLeft"]) player.vx = -player.speed;
    if (keys["d"] || keys["ArrowRight"]) player.vx = player.speed;

    // Jump
    if ((keys["w"] || keys["ArrowUp"] || keys[" "]) && player.grounded) {
      player.vy = -player.jumpStrength;
      player.grounded = false;
    }

    // Gravity
    player.vy += GRAVITY * delta;

    // Apply movement
    player.x += player.vx * delta;
    player.y += player.vy * delta;

    player.grounded = false;

    // Platform collisions
    platforms.forEach(p => {
      if (rectIntersect(player, p)) {
        if (player.vy > 0 && player.y + player.h - player.vy * delta <= p.y) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.grounded = true;
        }
      }
    });

    // Camera follows player
    cameraX = Math.max(0, player.x - 200);

    // Win condition
    if (rectIntersect(player, exit)) {
      isComplete = true;
      result = {
        islandType: "side_scroller",
        outcome: "success",
        duration: Math.round(performance.now() - startTime),
        distance: Math.round(player.x)
      };
    }
  }

  function rectIntersect(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function draw(ctx) {
    ctx.fillStyle =
      config.theme === "danger" ? "#1b0000" :
      config.theme === "dream" ? "#001b1b" :
      "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Platforms
    ctx.fillStyle = "#444";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

    // Exit
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.w, exit.h);

    // Player
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.restore();

    // UI
    ctx.fillStyle = "#aaa";
    ctx.font = "16px monospace";
    ctx.fillText("Reach the far edge", 20, 30);
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
