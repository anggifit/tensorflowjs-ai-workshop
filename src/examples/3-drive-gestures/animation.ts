import { type Group, type Object3DEventMap, WebGLRenderer } from "three";
import { loadCamera } from "./camera.js";
import { loadKeyboardControls } from "./controls.js";
import { loadCar, loadScene } from "./scene.js";

let car: Group<Object3DEventMap> | undefined;
let speed = 0;
let turningSpeed = 0;
const acceleration = 0.03;
const maxSpeed = 1;
const breakDeceleration = 0.05;
const maxTurnSpeed = 0.2;
const turnAcceleration = 0.002;

export function simulateIdle() {
  decelerate();
  stopTurning();
  // Decelerate progressively when no car action is ongoing
  if (speed !== 0) {
    setTimeout(() => simulateIdle(), 100);
  }
}

export function accelerate() {
  speed += acceleration;
  speed = Math.min(speed, maxSpeed);
  stopTurning();
}

export function stopAccelerate() {
  speed -= breakDeceleration;
  speed = Math.max(speed, 0);
}

export function decelerate() {
  speed -= acceleration;
  speed = Math.max(speed, 0);
}

export function stopDecelerate() {
  speed += breakDeceleration;
  speed = Math.min(speed, 0);
}

export function stopTurning() {
  turningSpeed = 0;
}

export function turnLeft() {
  turningSpeed = Math.min(turningSpeed + turnAcceleration, maxTurnSpeed);
}

export function turnRight() {
  turningSpeed = Math.min(turningSpeed - turnAcceleration, maxTurnSpeed);
}

function loadRenderer(): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

// Set the target frames per second (FPS)
const targetFPS = 60;
const interval = 1000 / targetFPS;
// Initialize variables to track time
let lastFrameTime = 0;

// Game loop
const animate = (timestamp: number) => {
  // Calculate the time elapsed since the last frame
  const elapsed = timestamp - lastFrameTime;

  // If not enough time has passed, skip the animation
  if (elapsed < interval || !car) {
    // (elapsed % interval) helps in compensating for any drift in timing, making the animation smoother.
    lastFrameTime = timestamp - (elapsed % interval);
    requestAnimationFrame(animate);
    return;
  }

  lastFrameTime = timestamp - (elapsed % interval);

  // Update car position based on its rotation
  car.rotation.y += turningSpeed;
  car.position.x += speed * Math.sin(car.rotation.y);
  car.position.z += speed * Math.cos(car.rotation.y);

  // Update the camera to follow the car
  camera.position.x = car.position.x;
  camera.position.y = car.position.y + 5;
  camera.position.z = car.position.z + 10;
  camera.lookAt(car.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

loadKeyboardControls();
const scene = loadScene();
const camera = loadCamera();
const renderer = loadRenderer();

export const startAnimating = async (): Promise<void> => {
  car = await loadCar();
  scene.add(car);
  animate(0);
};
