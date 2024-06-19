import * as tf from "@tensorflow/tfjs";
import { log } from "./utils.js";

const trainingIterations = 500;

const valuesToPredict = [-2, 5, 25, 84, 90];

// Prepare training Data
const inputTrainingValues = [0, 1, 2, 3, 4, 5];
const outputCorrectAnswers = [-1, 0, 1, 2, 3, 4];
const xs = tf.tensor(inputTrainingValues);
const ys = tf.tensor(outputCorrectAnswers);
log(`Created tensor (xs) with ${inputTrainingValues} values as training input`);
log(`Created tensor (ys) with ${outputCorrectAnswers} values as correct answers`);

/*
 * Define a Linear Regression Model
 * In a sequential model, the output from one layer is the input to the next layer
 */
const model = tf.sequential();

/*
 * Add one dense layer to the model.
 * Dense layers are the most common and basic layers in neural networks.
 * Each neuron in a dense layer receives input from all the neurons in the previous layer.
 * The input shape is 1 (one dimentional)
 * The unit is the number of neurons in the layer (1) and it is the output layer.
 */
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

/*
 * Compiling a TensorFlow model means configuring and preparing it for training
 * and evaluation. The configuration will be used to guide the training
 * process by adjusting the model's parameters to minimize the errors.
 *
 * - Loss function: Quantifies the difference between the predicted values of a
 *   model and the actual target values.
 * - Optimizer: Algorithm used to minimize the loss function by adjusting the weights of
 *   the model.
 */
model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

log(`Training the model with ${trainingIterations} epochs (iterations)...`);
await model.fit(xs, ys, { epochs: trainingIterations });

log("Predicting values using the model...");
for (const value of valuesToPredict) {
  const prediction = (await model.predict(tf.tensor([value]))) as tf.Tensor<tf.Rank>;
  const results = prediction.arraySync() as number[][];
  const predictedValue = results[0];
  log(`For value ${value}, the prediction is: ${predictedValue}`);
}
