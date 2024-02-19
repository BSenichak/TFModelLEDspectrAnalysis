import * as tf from "@tensorflow/tfjs"

async function makePrediction(model, inputShape, inputData) {
    const inputSample = tf.tensor2d(inputData, [1, inputShape]); // Вхідні дані для прогнозу
    const prediction = model.predict(inputSample); // Прогноз

    const predictedClass = (await prediction.argMax(1).data())[0]; // Клас з найвищою вірогідністю
    console.log("Прогнозований клас:", predictedClass);
    

    //Вивільняємо ресурси після використання
    inputSample.dispose();
    prediction.dispose();
    return predictedClass
}

export default makePrediction