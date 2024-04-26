import * as tf from "@tensorflow/tfjs";

async function makePrediction(model, inputShape, inputData, numClasses) {
    try {
        const inputSample = tf.tensor3d([inputData]); // Вхідні дані для прогнозу
        const prediction = model.predict(inputSample); // Прогноз
        let arg = (await prediction.argMax(1).data())[0];
        const predictedClass = Math.floor(arg / (128/ numClasses));
        console.log(arg)
        console.log("Прогнозований клас:", predictedClass);
        inputSample.dispose();
        prediction.dispose();
        return predictedClass;
    } catch (error) {
        console.log(error.message);
    }
}

export default makePrediction;
