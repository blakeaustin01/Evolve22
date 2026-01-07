import { createTopDownIsland } from "./islands/topDownIsland.js";
import { createSideScrollerIsland } from "./islands/sideScrollerIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let history = [];
let currentIsland = null;
let pendingConfig = null;
let gameState = "playing";
let transitionTimer = 0;
let lastTime = 0;

async function loadIsland(config) {
  if (config.island_type === "side_scroller") {
    return createSideScrollerIsland(config.parameters);
  }
  return createTopDownIsland(config.parameters);
}

async function requestNextIsland(lastResult) {
  const res = await fetch("/.netlify/functions/director", {
    method: "POST",
    body: JSON.stringify({
      history,
      lastResult
    })
  });
  return res.json();
}

function drawTransition(ctx, result) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#00ff88";
  ctx.font = "20px monospace";
  ctx.fillText("ISLAND COMPLETE", 290, 260);

  ctx.fillStyle = "#aaa";
  ctx.font = "16px monospace";
  ctx.fillText(
    `Outcome: ${result.outcome}`,
    320,
    300
  );
}

async function startGame() {
  currentIsland = createTopDownIsland({
    theme: "escape",
    playerSpeed: 240
  });
  requestAnimationFrame(loop);
}

async function loop(time) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  if (gameState === "playing") {
    currentIsland.update(delta);
    currentIsland.draw(ctx);

    if (currentIsland.isComplete) {
      history.push(currentIsland.result);
      gameState = "transition";
      transitionTimer = 0;
      pendingConfig = await requestNextIsland(currentIsland.result);
    }
  }

  else if (gameState === "transition") {
    transitionTimer += delta;
    drawTransition(ctx, history[history.length - 1]);

    if (transitionTimer > 1.5 && pendingConfig) {
      currentIsland = await loadIsland(pendingConfig);
      gameState = "playing";
    }
  }

  requestAnimationFrame(loop);
}

startGame();
