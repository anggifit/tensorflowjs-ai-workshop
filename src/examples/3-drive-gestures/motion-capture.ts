import * as tf from "@tensorflow/tfjs";
import { accelerate, simulateIdle, turnLeft, turnRight } from "./animation.js";

const modelPath = "./ai-model/model.json";
// Define the actions that the model will predict
export enum Action {
  IDLE = "idle",
  ACCELERATE = "accelerate",
  RIGHT = "right",
  LEFT = "left",
}
const actionClassNames = Object.values(Action);
let currentAction = Action.IDLE;

const actionMap: { [key: string]: () => void } = {
  idle: () => simulateIdle(),
  accelerate: () => accelerate(),
  right: () => turnRight(),
  left: () => turnLeft(),
};

// Load the model
let model: tf.LayersModel;
async function loadModel() {
  // Load model along with metadata and weights
  model = await tf.loadLayersModel(modelPath);
}

// Capture data from webcam and pass it to the model
async function predictFromWebcam() {
  const webcamElement = document.getElementById("webcam") as HTMLVideoElement;
  if (navigator.mediaDevices.getUserMedia) {
    // Reverse the webcam preview
    webcamElement.style.transform = "scaleX(-1)";
    const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 1.0 } });
    webcamElement.srcObject = stream;
    // After the video feed has started, run the model
    webcamElement.onloadedmetadata = () => {
      webcamElement.play();
      runModelOnStream();
    };
  }

  async function runModelOnStream() {
    while (true) {
      const webcamCapture = tf.browser.fromPixels(webcamElement);
      // Teachable Machine models expect 224x224 images
      const resizedCapture = tf.image.resizeBilinear(webcamCapture, [224, 224], false, true);
      // Normalize the image from 0..255 to -1..1, because the model expects values between -1 and 1
      const normalizedCapture = resizedCapture.div(127.5).sub(1).expandDims(0);

      const prediction = (await model.predict(normalizedCapture)) as tf.Tensor;
      const predictedAction = actionClassNames[(await prediction.argMax(1).data())[0]];

      // Clean up resources
      webcamCapture.dispose();
      resizedCapture.dispose();
      normalizedCapture.dispose();

      // Act only if we have a high confidence in the prediction (>90% certainty)
      const predictionCertainty = (await prediction.max().data())[0];

      // Avoid running the same action if it has not changed
      if (predictionCertainty > 0.8 && predictedAction !== currentAction) {
        currentAction = predictedAction;
        actionMap[currentAction]();
      }
      await tf.nextFrame();
    }
  }
}

export async function startMotionCapture() {
  await loadModel();
  predictFromWebcam();
}
