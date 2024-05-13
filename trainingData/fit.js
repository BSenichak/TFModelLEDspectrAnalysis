import * as tf from "@tensorflow/tfjs";
import TFModel from "../TFmodel/TFModel.js";
import fitModel from "../fitModel/fitModel.js";
import { getAllLeds } from "../mongodb.js";

export async function getDataToTensor() {
    let data = await getAllLeds();
    let validTensors = data.filter((i) => i.tensors.length >= 50);
    let tensors = validTensors.map((i) => i.tensors);
    let train = tensors.map(i=>i.slice(0,45))
    let valid = tensors.map(i=>i.slice(45))
    let ids = validTensors.map((i) => i._id);
    return { tensors, ids, train, valid };
}
let inputShape = [100, 3];

async function fit() {
    try {
        let startTime = Date.now();
        let { tensors, ids, train, valid } = await getDataToTensor();
        let numClasses = tensors.length;

        //train
        let labels = [];
        let canals = [];
        let colors = [];
        let examples = [];
        for(let i = 1; i <= numClasses; i++){
            canals.push(i);
        }
        for (let i = 0; i < 100; i++) {
            colors.push(canals);
        }
        for (let i = 0; i < 45; i++) {
            examples.push(colors);
        }
        for (let i = 0; i < ids.length; i++) {
            labels = [...labels, ...examples];
        }
        let trainLabels = tf.tensor3d(labels);
        let trainData = tf.tensor3d(train.flat(1));

        //valid
        let vlabels = [];
        let vcanals = [];
        let vcolors = [];
        let vexamples = [];
        for(let i = 1; i <= numClasses; i++){
            vcanals.push(i);
        }
        for (let i = 0; i < 100; i++) {
            vcolors.push(vcanals);
        }
        for (let i = 0; i < 5; i++) {
            vexamples.push(vcolors);
        }
        for (let i = 0; i < ids.length; i++) {
            vlabels = [...vlabels, ...vexamples];
        }
        let validLabels = tf.tensor3d(vlabels);
        let validData = tf.tensor3d(valid.flat(1));

        let model = TFModel(inputShape, numClasses);
        const numEpochs = 50;
        await fitModel(
            model,
            trainData,
            trainLabels,
            validData,
            validLabels,
            numEpochs
        ).then(() => {
            console.log("Model was fitted");
        });
        console.log("Classes: ",ids.length);
        console.log("Time for training:", (Date.now() - startTime) / 1000, "s");
        return { model, ids, inputShape, ready: true };
    } catch (error) {
        console.error(error.message);
    }
}

export default fit;
