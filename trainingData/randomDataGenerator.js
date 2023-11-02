import * as tf from "@tensorflow/tfjs";

const randomDataGenerator = (numSamples, inputShape, numClasses) => {
    const randomData = () => tf.randomNormal([numSamples, inputShape]);
    const randomLabels = () =>
        tf.oneHot(
            tf.randomUniform([numSamples], 0, numClasses, "int32"),
            numClasses
        );
    const trainData = randomData();
    const trainLabels = randomLabels();
    const validationData = randomData();
    const validationLabels = randomLabels();

    return [trainData, trainLabels, validationData, validationLabels];
};

export default randomDataGenerator;
