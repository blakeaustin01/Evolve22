import { createTopDownIsland } from "./islands/topDownIsland.js";
import { createSideScrollerIsland } from "./islands/sideScrollerIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let history = [];
let difficultyLevel = 1;
let currentIsland = null;
let pendingConfig = null;
let gameState = "playing";
let transitionTimer = 0;
let lastTime = 0;

async function loadIsland(config) {
  if (config.island_type === "side_scroller") {
    return createSideScrollerIsland({
      ...config.parameters,
      difficulty: difficultyLevel
    });
  }
  return createTopDownIsland({
    ...config.parameters,
    difficulty: difficultyLevel
  });
}

async function requestNextIsland(lastResult) {
  const res = await fetch("/.netlify/functions/director", {
    method: "POST",
    body: JSON.stringify({
      history,
      lastResult,
      difficultyLevel
    })
  });
  return res.json();
}

function drawTransition(ctx, result) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#00ff88";
  ctx.font = "20px monospace";
  ctx.fillText("ISLAND COMPLETE", 290, 240);

  ctx.fillStyle = "#aaa";
  ctx.font = "16px monospace";
  ctx.fillText(`Difficulty: ${difficultyLevel}`, 330, 280);
  ctx.fillText(`Outcome: ${result.outcome}`, 330, 310);
}

async function startGame() {
  currentIsland = createTopDownIsland({
    difficulty: difficultyLevel
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

      if (currentIsland.result.outcome === "success") {
        difficultyLevel++;
      }

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
