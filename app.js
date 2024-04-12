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
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

let isTFReady = false;
let isDBReady = false;

// ! MongoDB model

isDBReady = await run().catch(console.dir);

// ! tfModel

async function getDataToTensor() {
    let data = await getAllLeds();
    let validTensors = data.filter((i) => i.tensors.length >= 50);
    let tensors = validTensors.map((i) => i.tensors);
    let names = validTensors.map((i) => i.name);
    return { tensors, names };
}
let inputShape = [ 50, 100, 3]

async function fit() {
    try {
        let { tensors, names } = await getDataToTensor();
        let labels = []
        let canals = [1, 2]
        let colors = []
        for(let i = 0; i < 100; i++) {
            colors.push(canals)
        }
        let examples = []
        for(let i = 0; i < 50; i++) {
            examples.push(colors)
        }
        for(let i = 0; i < names.length; i++) {
            labels.push(examples)
        }
        let numClasses = tensors.length;
        
        let trainLabels = tf.tensor4d(labels)

        let trainData =  tf.tensor4d(tensors)
        let model = TFModel(inputShape, numClasses);
        const numEpochs = 50;
        await fitModel(
            model,
            trainData,
            trainLabels,
            trainData,
            trainLabels,
            numEpochs
        ).then(() => {
            isTFReady = true;
        });
        return model
        
    } catch (error) {
        console.error(error.message);
    }
}
let model = await fit();


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
