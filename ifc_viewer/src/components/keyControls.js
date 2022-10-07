import { MathUtils } from "three";
import { KeyboardKeyHold } from "hold-event/dist/hold-event.min.js";
// import { index } from "hold-event/dist/hold-event.min.js";

// Keyboards keys to navigate
const KEYCODE = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

// "W", "A", "S", "D" Keys Controls
const wKey = new KeyboardKeyHold(KEYCODE.W, 16.666);
const aKey = new KeyboardKeyHold(KEYCODE.A, 16.666);
const sKey = new KeyboardKeyHold(KEYCODE.S, 16.666);
const dKey = new KeyboardKeyHold(KEYCODE.D, 16.666);
// const eKey = new KeyboardKeyHold(KEYCODE.E, 16.666);
// const qKey = new KeyboardKeyHold(KEYCODE.Q, 16.666);

export function wasdKeyControls(cameraControls) {
  aKey.addEventListener("holding", function (event) {
    cameraControls.truck(-0.01 * event.deltaTime, 0, false);
  });
  dKey.addEventListener("holding", function (event) {
    cameraControls.truck(0.01 * event.deltaTime, 0, false);
  });
  wKey.addEventListener("holding", function (event) {
    cameraControls.forward(0.01 * event.deltaTime, false);
  });
  sKey.addEventListener("holding", function (event) {
    cameraControls.forward(-0.01 * event.deltaTime, false);
  });
  // eKey.addEventListener("holding", function (event) {
  //   cameraControls.forward(-0.01 * event.deltaTime, false);
  // });
  // qKey.addEventListener("holding", function (event) {
  //   cameraControls.forward(-0.01 * event.deltaTime, false);
  // });
}

// Arrows Keys Controls
const leftKey = new KeyboardKeyHold(KEYCODE.ARROW_LEFT, 100);
const rightKey = new KeyboardKeyHold(KEYCODE.ARROW_RIGHT, 100);
const upKey = new KeyboardKeyHold(KEYCODE.ARROW_UP, 100);
const downKey = new KeyboardKeyHold(KEYCODE.ARROW_DOWN, 100);

export function arrowsKeyControls(cameraControls) {
  leftKey.addEventListener("holding", function (event) {
    cameraControls.rotate(-0.1 * MathUtils.DEG2RAD * event.deltaTime, 0, true);
  });
  rightKey.addEventListener("holding", function (event) {
    cameraControls.rotate(0.1 * MathUtils.DEG2RAD * event.deltaTime, 0, true);
  });
  upKey.addEventListener("holding", function (event) {
    cameraControls.rotate(0, -0.05 * MathUtils.DEG2RAD * event.deltaTime, true);
  });
  downKey.addEventListener("holding", function (event) {
    cameraControls.rotate(0, 0.05 * MathUtils.DEG2RAD * event.deltaTime, true);
  });
}
