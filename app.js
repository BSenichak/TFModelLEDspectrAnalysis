// const tf = require("@tensorflow/tfjs-node");
import * as tf from "@tensorflow/tfjs";
import TFModel from "./TFmodel/TFModel.js";
import randomDataGenerator from "./trainingData/randomDataGenerator.js";
import makePrediction from "./prediction/makePrediction.js";
import fitModel from "./fitModel/fitModel.js";
import express from "express";
import mongodb, {
    addNewLed,
    addNewTensor,
    getAllLeds,
    getAllLedsNames,
    getOneLed,
    run,
} from "./mongodb.js";

let isTFReady = false;
let isDBReady = false;

// ! MongoDB model

isDBReady = await run().catch(console.dir);

// ! tfModel
const numSamples = 1000;
const inputShape = 100;
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
).then(() => {
    isTFReady = true;
});

// ! Express model

const app = express();

app.use("/*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

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
        } else {
            res.status(400);
            res.send(
                JSON.stringify({
                    error: "Wrong tensor",
                })
            );
        }
    });
});

app.post("/check", function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", async () => {
        data = JSON.parse(data);
        if (data) data.status = "ok";
        res.send(JSON.stringify(data));
    });
});

app.post("/addLed", function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", async () => {
        if (!data) {
            res.end();
            return;
        }
        data = JSON.parse(data);
        let result = await addNewLed(data);
        res.end(JSON.stringify(result));
    });
});

app.post("/addTensor", function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
        data += chunk;
    });
    req.on("end", async () => {
        if (!data) {
            res.end();
            return;
        }
        data = JSON.parse(data);
        let result = await addNewTensor(data);
        res.end(JSON.stringify(result));
    });
});

app.get("/getallleds", async function (req, res) {
    res.end(JSON.stringify(await getAllLeds()));
});

app.get("/getallledsnames", async function (req, res) {
    res.end(JSON.stringify(await getAllLedsNames()));
});

app.get("/getoneled", async function (req, res) {
    let id = req.query._id;
    if (id) {
        let result = await getOneLed(id);
        res.end(JSON.stringify(result));
    }
});

app.listen(3000, () => {
    console.log("Server on port", 3000);
});
