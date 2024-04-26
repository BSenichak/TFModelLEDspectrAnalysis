// const tf = require("@tensorflow/tfjs-node");
import makePrediction from "./prediction/makePrediction.js";
import express from "express";
import fit from "./trainingData/fit.js";
import mongodb, {
    addNewLed,
    addNewTensor,
    getAllLeds,
    getAllLedsNames,
    getOneLed,
    run,
    updateData,
} from "./mongodb.js";

let isTFReady = false;
let isDBReady = false;

isDBReady = await run().catch(console.dir);
// await fit()
// let ready = true
let { model, ids, inputShape, ready } = await fit();
isTFReady = ready;

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
        if (!isTFReady) {
            res.status(200);
            res.send(
                JSON.stringify({
                    error: "Model is not ready",
                })
            );
        } else if (tensor) {
            let classNumber = await makePrediction(model, inputShape, tensor, ids.length);
            let result = await getOneLed(ids[classNumber]);
            res.send(JSON.stringify(result));
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

app.post("/updateleddata", function (req, res) {
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
        await updateData(data._id, data);
        let result = await getOneLed(data._id);
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
