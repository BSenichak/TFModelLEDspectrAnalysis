import * as tf from "@tensorflow/tfjs";

async function makePrediction(model, inputShape, inputData) {
    try {
        let data = []
        for(let i = 0; i < 50; i++) {
            data.push(inputData)
        }
        const inputSample = tf.tensor4d([data]); // Вхідні дані для прогнозу
        const prediction = model.predict(inputSample); // Прогноз

        const predictedClass = (await prediction.argMax(1).data())[0]; // Клас з найвищою вірогідністю
        console.log("Прогнозований клас:", predictedClass);

        //Вивільняємо ресурси після використання
        inputSample.dispose();
        prediction.dispose();
        return predictedClass;
    } catch (error) {
        console.log(error.message);
    }
}

export default makePrediction;
