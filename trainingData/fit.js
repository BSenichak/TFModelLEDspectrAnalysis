import * as tf from "@tensorflow/tfjs";
import TFModel from "../TFmodel/TFModel.js";
import fitModel from "../fitModel/fitModel.js";
import { getAllLeds } from "../mongodb.js";

export async function getDataToTensor() {
    let data = await getAllLeds();
    let validTensors = data.filter((i) => i.tensors.length >= 50);
    let tensors = validTensors.map((i) => i.tensors);
    let ids = validTensors.map((i) => i._id);
    return { tensors, ids };
}
let inputShape = [100, 3];

async function fit() {
    try {
        let startTime = Date.now();
        let { tensors, ids } = await getDataToTensor();
        let numClasses = tensors.length;
        let labels = [];
        let canals = [];
        for(let i = 1; i <= numClasses; i++){
            canals.push(i);
        }
        let colors = [];
        for (let i = 0; i < 100; i++) {
            colors.push(canals);
        }
        let examples = [];
        for (let i = 0; i < 50; i++) {
            examples.push(colors);
        }
        for (let i = 0; i < ids.length; i++) {
            labels = [...labels, ...examples];
        }

        let trainLabels = tf.tensor3d(labels);

        let trainData = tf.tensor3d(tensors.flat(1));
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
