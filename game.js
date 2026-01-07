import { createTopDownIsland } from "./islands/topDownIsland.js";
import { createSideScrollerIsland } from "./islands/sideScrollerIsland.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const islands = [
  () => createTopDownIsland({
    theme: "escape",
    playerSpeed: 240
  }),
  () => createSideScrollerIsland({
    theme: "danger",
    speed: 320
  })
];

let islandIndex = 0;
let currentIsland = islands[islandIndex]();
let lastTime = 0;

function loop(time) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  currentIsland.update(delta);
  currentIsland.draw(ctx);

  if (currentIsland.isComplete) {
    console.log("ISLAND COMPLETE:", currentIsland.result);
    islandIndex = (islandIndex + 1) % islands.length;
    currentIsland = islands[islandIndex]();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
