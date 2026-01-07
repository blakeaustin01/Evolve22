export function createSideScrollerIsland(config = {}) {
  const WIDTH = 800;
  const HEIGHT = 600;
  const GROUND = 520;
  const GRAVITY = 1800;

  const player = {
    x: 50,
    y: GROUND - 30,
    w: 25,
    h: 30,
    vx: 0,
    vy: 0,
    speed: 320,
    jump: 650,
    grounded: false
  };

  const platforms = [
    { x: 0, y: GROUND, w: 2000, h: 80 },
    { x: 300, y: 420, w: 120, h: 20 },
    { x: 520, y: 360, w: 120, h: 20 },
    { x: 760, y: 300, w: 120, h: 20 }
  ];

  const exit = { x: 1500, y: GROUND - 40, w: 30, h: 40 };
  const keys = {};
  let camX = 0;
  let isComplete = false;
  let result = null;
  const startTime = performance.now();

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  function update(dt) {
    if (isComplete) return;

    player.vx = 0;
    if (keys["a"] || keys["ArrowLeft"]) player.vx = -player.speed;
    if (keys["d"] || keys["ArrowRight"]) player.vx = player.speed;

    if ((keys["w"] || keys[" "] || keys["ArrowUp"]) && player.grounded) {
      player.vy = -player.jump;
      player.grounded = false;
    }

    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.grounded = false;

    platforms.forEach(p => {
      if (rect(player, p) && player.vy > 0) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.grounded = true;
      }
    });

    camX = Math.max(0, player.x - 200);

    if (rect(player, exit)) {
      isComplete = true;
      result = {
        islandType: "side_scroller",
        outcome: "success",
        duration: Math.round(performance.now() - startTime)
      };
    }
  }

  function rect(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function draw(ctx) {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    ctx.translate(-camX, 0);

    ctx.fillStyle = "#444";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

    ctx.fillStyle = "#00ff88";
    ctx.fillRect(exit.x, exit.y, exit.w, exit.h);

    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.restore();

    ctx.fillStyle = "#aaa";
    ctx.font = "16px monospace";
    ctx.fillText("Reach the far edge", 20, 30);
  }

  return {
    update,
    draw,
    get isComplete() { return isComplete; },
    get result() { return result; }
  };
}
