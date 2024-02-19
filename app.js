// const tf = require("@tensorflow/tfjs-node");
import * as tf from "@tensorflow/tfjs";
import TFModel from "./TFmodel/TFModel.js";
import randomDataGenerator from "./trainingData/randomDataGenerator.js";
import makePrediction from "./prediction/makePrediction.js";
import fitModel from "./fitModel/fitModel.js";
import express from "express";

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
).then(() => console.log("TF DONE"));

const app = express();

app.post("/predict", function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", async () => {
        data = JSON.parse(data);
        let tensor = data.tensor;
        if (tensor) {
            let classNumber = await makePrediction(model, inputShape, tensor);
            res.send(JSON.stringify(classNumber));
        }else{
            res.status(400)
            res.send(JSON.stringify({
                error: "Wrong tensor"
            }))
        }
    });
});

app.listen(3000, () => {
    console.log("Server on port", 3000);
});
