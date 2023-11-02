// const tf = require("@tensorflow/tfjs-node");
import * as tf from "@tensorflow/tfjs";
import TFModel from "./TFmodel/TFModel.js";
import randomDataGenerator from "./trainingData/randomDataGenerator.js";
import makePrediction from "./prediction/makePrediction.js";
import fitModel from "./fitModel/fitModel.js";

const numSamples = 1000;
const inputShape = 10;
const numClasses = 5;

const model = TFModel(inputShape, numClasses);

const [trainData, trainLabels, validationData, validationLabels] =
    randomDataGenerator(numSamples, inputShape, numClasses);

const numEpochs = 50;
fitModel(
    model,
    trainData,
    trainLabels,
    validationData,
    validationLabels,
    numEpochs
).then(() =>
    makePrediction(model, inputShape, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
);
