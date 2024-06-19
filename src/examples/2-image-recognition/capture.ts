import * as tf from "@tensorflow/tfjs";
import { Theme, setTheme } from "./theme-manager.js";
import { sleep } from "./utils.js";

const modelPath = "./ai-model/model.json";
// The classes that the model can recognize, based on the theme names
const classNames = Object.values(Theme);

// Load the model
async function loadModel(): Promise<tf.LayersModel> {
  // Load model along with metadata and weights
  return tf.loadLayersModel(modelPath);
}

async function loadCamera(): Promise<HTMLVideoElement> {
  const webcamElement = document.getElementById("webcam") as HTMLVideoElement;
  const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 1.0 } });
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices.getUserMedia) {
      return reject("Failed to access webcam");
    }
    // Reverse the webcam preview
    webcamElement.style.transform = "scaleX(-1)";
    webcamElement.srcObject = stream;
    webcamElement.onloadedmetadata = () => {
      webcamElement.play();
      resolve(webcamElement);
    };
  });
}

// Capture data from webcam and pass it to the model
async function startRealtimePredict(
  webcamElement: HTMLVideoElement,
  model: tf.LayersModel,
  onPredictedClass: (predictedClass: Theme) => void,
) {
  while (true) {
    const webcamCapture = tf.browser.fromPixels(webcamElement);
    // Teachable Machine models expect 224x224 images
    const resizedCapture = tf.image.resizeBilinear(webcamCapture, [224, 224], false, true);
    // Normalize the image from 0..255 to -1..1, because the model expects values between -1 and 1
    const normalizedCapture = resizedCapture.div(127.5).sub(1).expandDims(0);

    const prediction = (await model.predict(normalizedCapture)) as tf.Tensor;
    const predictedClass = classNames[(await prediction.argMax(1).data())[0]];
    // Act only if we have a high confidence in the prediction (>90% certainty)
    const predictionCertainty = (await prediction.max().data())[0];
    if (predictionCertainty > 0.9) {
      onPredictedClass(predictedClass);
    }
    webcamCapture.dispose();
    resizedCapture.dispose();
    normalizedCapture.dispose();
    // Delay a bit the next frame to avoid using too many resources
    await sleep(500);
    await tf.nextFrame();
  }
}

export async function start() {
  const model = await loadModel();
  const camera = await loadCamera();
  startRealtimePredict(camera, model, (predictedClass) => {
    setTheme(predictedClass);
  });
}
