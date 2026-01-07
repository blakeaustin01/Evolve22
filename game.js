import { createTopDownIsland } from "./islands/topDownIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let currentIsland = createTopDownIsland();
let lastTime = 0;

function gameLoop(timestamp) {
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  currentIsland.update(delta);
  currentIsland.draw(ctx);

  if (currentIsland.isComplete) {
    console.log("ISLAND COMPLETE:", currentIsland.result);
    // Later: send result to AI and load next island
    return;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

