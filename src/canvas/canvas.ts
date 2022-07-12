// eslint-disable-next-line import/no-unresolved, import/extensions
import { output } from "../main";

// //////////////////////////CANVAS//////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

// https://html.spec.whatwg.org/multipage/canvas.html#best-practices

const canvas = document.getElementById("visualizer") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.style.boxShadow = `0 0 5px 10px hsla(223, 43%, 16%, 1)`; // blur the edges

let lastX = context.canvas.width * Math.random();
let lastY = context.canvas.height * Math.random();
let hue = 0;
export function drawLineOnCanvas() {
  context.save();
  context.translate(context.canvas.width / 2, context.canvas.height / 2);
  context.scale(0.9, 0.9);
  context.translate(-context.canvas.width / 2, -context.canvas.height / 2);

  context.beginPath();
  context.lineWidth = 1 + Math.sin(output * 10);
  context.moveTo(lastX, lastY);
  lastX = context.canvas.width * Math.random();
  lastY = context.canvas.height * Math.random();
  context.bezierCurveTo(
    context.canvas.width * Math.random(),
    context.canvas.height * Math.random(),
    context.canvas.width * Math.random(),
    context.canvas.height * Math.random(),
    lastX,
    lastY
  );

  hue += 10 * Math.random();
  context.strokeStyle = `hsl(${hue}, 50%, 50%)`;
  context.shadowColor = "white";
  context.shadowBlur = 10;
  context.stroke();
  context.restore();
}
export function fillBlankOnCanvas() {
  context.fillStyle = "hsla(223, 42%, 16%, 0.618)";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}
