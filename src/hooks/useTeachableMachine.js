import * as tf from '@tensorflow/tfjs';

const useTeachableMachine = async () => {
    const modelURL = '/model/model.json';
    const model = await tf.loadLayersModel(modelURL);

    const predictImage = async (imageElement) => {
        const tensor = tf.browser.fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224]) 
            .toFloat()
            .expandDims(); 

        const predictions = await model.predict(tensor).data();
        return predictions;
    };

    return { predictImage };
};

export default useTeachableMachine;
