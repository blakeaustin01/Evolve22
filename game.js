import { createTopDownIsland } from "./islands/topDownIsland.js";
import { createSideScrollerIsland } from "./islands/sideScrollerIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let history = [];
let currentIsland = null;
let lastTime = 0;

async function loadIsland(config) {
  if (config.island_type === "side_scroller") {
    return createSideScrollerIsland(config.parameters);
  }
  return createTopDownIsland(config.parameters);
}

async function requestNextIsland(lastResult) {
  const response = await fetch("/.netlify/functions/director", {
    method: "POST",
    body: JSON.stringify({
      history,
      lastResult
    })
  });

  return response.json();
}

async function startGame() {
  const initialConfig = {
    island_type: "top_down",
    parameters: { theme: "escape", playerSpeed: 240 }
  };

  currentIsland = await loadIsland(initialConfig);
  requestAnimationFrame(loop);
}

async function loop(time) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  currentIsland.update(delta);
  currentIsland.draw(ctx);

  if (currentIsland.isComplete) {
    history.push(currentIsland.result);

    const nextConfig = await requestNextIsland(currentIsland.result);
    currentIsland = await loadIsland(nextConfig);
  }

  requestAnimationFrame(loop);
}

startGame();
