import * as tf from "@tensorflow/tfjs";

async function makePrediction(model, inputShape, inputData, numClasses) {
    try {
        const inputSample = tf.tensor3d([inputData]); // Вхідні дані для прогнозу
        const prediction = model.predict(inputSample); // Прогноз
        let arr = await prediction.argMax(1).data()
        console.log("all: " + arr)
        const predictedClass = arr.indexOf(Math.max(...arr))
        console.log("Прогнозований клас:", predictedClass);
        inputSample.dispose();
        prediction.dispose();
        return predictedClass;
    } catch (error) {
        console.log(error.message);
    }
}

export default makePrediction;
