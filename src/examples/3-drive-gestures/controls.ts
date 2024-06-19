import {
  accelerate,
  decelerate,
  stopAccelerate,
  stopDecelerate,
  stopTurning,
  turnLeft,
  turnRight,
} from "./animation.js";

export function loadKeyboardControls() {
  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        accelerate();
        break;
      case "ArrowDown":
        decelerate();
        break;
      case "ArrowLeft":
        turnLeft();
        break;
      case "ArrowRight":
        turnRight();
        break;
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        stopAccelerate();
        break;
      case "ArrowDown":
        stopDecelerate();
        break;
      case "ArrowLeft":
        stopTurning();
        break;
      case "ArrowRight":
        stopTurning();
        break;
    }
  }
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}
