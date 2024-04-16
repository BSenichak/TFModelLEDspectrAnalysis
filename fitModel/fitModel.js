const fitModel = async (model, trainData, trainLabels, validationData, validationLabels, numEpochs) => {
    
    await model
        .fit(trainData, trainLabels, {
            epochs: numEpochs,
            validationData: [validationData, validationLabels],
        })
        .then((info) => {
            console.log("Тренування завершено");
            const result = model.evaluate(validationData, validationLabels);
            console.log("Loss:", result[0].dataSync()[0]);
            console.log("Accuracy:", result[1].dataSync()[0]);
        });
};

export default fitModel
