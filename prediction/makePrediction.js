import * as tf from "@tensorflow/tfjs";

async function makePrediction(model, inputShape, inputData) {
    try {
        const inputSample = tf.tensor3d([inputData]); // Вхідні дані для прогнозу
        const prediction = model.predict(inputSample); // Прогноз
        const predictedClass = Math.floor(
            (await prediction.argMax(1).data())[0] / 50
        );
        console.log("Прогнозований клас:", predictedClass);
        inputSample.dispose();
        prediction.dispose();
        return predictedClass;
    } catch (error) {
        console.log(error.message);
    }
}

export default makePrediction;
