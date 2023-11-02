import * as tf from "@tensorflow/tfjs"

const TFModel = (inputShape, numClasses) => {
    const model = tf.sequential();
    model.add(tf.layers.inputLayer({ inputShape: [inputShape] }));
    model.add(tf.layers.dense({ units: 128, activation: "relu" }));
    model.add(tf.layers.dense({ units: 64, activation: "relu" }));
    model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

    model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
    });
    return model;
};

export default TFModel
