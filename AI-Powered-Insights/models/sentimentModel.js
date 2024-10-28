// models/sentimentModel.js

const tf = require('@tensorflow/tfjs-node');

let model;

const loadModel = async () => {
    try {
        model = await tf.loadLayersModel('file://./models/model/model.json');
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Failed to load model:", error);
        throw error; // Rethrow to be caught in the controller
    }
};

loadModel(); // Load the model when the file is imported

const analyzeSentiment = async (text) => {
    if (!model) {
        throw new Error('Model is not loaded'); // Error if model isn't ready
    }

    // Preprocess the input text
    const preprocessedInput = preprocessText(text); // Call to the defined function
    const inputTensor = tf.tensor2d([preprocessedInput], [1, 16]); // Adjust shape to [1, 16]

    const prediction = model.predict(inputTensor);
    const result = prediction.dataSync(); // Get the result
    return result;
};

// Implement your preprocessing logic
const preprocessText = (text) => {
    // Example preprocessing: Tokenization and encoding
    const tokens = tokenize(text); // Tokenize the text
    // Ensure tokens is an array of the right length (16)
    const paddedTokens = new Array(16).fill(0); // Initialize a zero vector of size 16
    for (let i = 0; i < Math.min(tokens.length, 16); i++) {
        paddedTokens[i] = tokens[i]; // Fill the vector with token values
    }
    return paddedTokens;
};

// Example tokenize function (implement this based on your tokenizer)
const tokenize = (text) => {
    // Simple example: Convert text to lower case and split into words
    const words = text.toLowerCase().split(' ');
    const wordVector = new Array(16).fill(0); // Adjust to your specific encoding method
    words.forEach((word, index) => {
        if (index < 16) {
            wordVector[index] = 1; // Simple presence encoding
        }
    });
    return wordVector;
};

module.exports = { analyzeSentiment };
