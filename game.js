import { createTopDownIsland } from "./islands/topDownIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const islandConfig = {
  playerSpeed: 260,
  exitPosition: { x: 720, y: 520 },
  walls: [
    { x: 100, y: 100, w: 500, h: 20 },
    { x: 100, y: 100, w: 20, h: 400 },
    { x: 200, y: 300, w: 400, h: 20 }
  ],
  theme: "escape"
};

let currentIsland = createTopDownIsland(islandConfig);
let lastTime = 0;

function loop(time) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  currentIsland.update(delta);
  currentIsland.draw(ctx);

  if (!currentIsland.isComplete) {
    requestAnimationFrame(loop);
  } else {
    console.log("ISLAND COMPLETE:", currentIsland.result);
    // next: transition → AI → next island
  }
}

requestAnimationFrame(loop);
