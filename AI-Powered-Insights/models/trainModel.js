// trainModel.js
const tf = require('@tensorflow/tfjs-node');

// Sample training data with corresponding sentiment labels
const trainingData = [
    { text: 'I love this!', label: 1 },
    { text: 'This is amazing!', label: 1 },
    { text: 'I feel great!', label: 1 },
    { text: 'I am so happy.', label: 1 },
    { text: 'This is bad.', label: 0 },
    { text: 'I hate this.', label: 0 },
    { text: 'I am sad.', label: 0 },
    { text: 'This is terrible.', label: 0 },
];

// Simple text preprocessing function
const preprocessText = (text) => {
    const words = text.toLowerCase().split(' ');
    const wordSet = [...new Set(words)]; // Unique words
    return wordSet;
};

// Create a vocabulary from the training data
const vocabulary = Array.from(new Set(trainingData.flatMap(data => preprocessText(data.text))));

// Encode text to numerical values based on the vocabulary
const encodeText = (text) => {
    const encoded = new Array(vocabulary.length).fill(0);
    const words = text.toLowerCase().split(' ');
    words.forEach(word => {
        const index = vocabulary.indexOf(word);
        if (index !== -1) {
            encoded[index] = 1; // Simple presence/absence encoding
        }
    });
    return encoded;
};

// Prepare training data for the model
const xs = tf.tensor2d(trainingData.map(item => encodeText(item.text))); // 2D tensor
const ys = tf.tensor2d(trainingData.map(item => item.label), [trainingData.length, 1]); // 2D tensor

// Create a simple sequential model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 4, activation: 'relu', inputShape: [vocabulary.length] }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

// Compile the model
model.compile({
    loss: 'binaryCrossentropy',
    optimizer: 'adam',
    metrics: ['accuracy'],
});

// Train the model
(async () => {
    await model.fit(xs, ys, {
        epochs: 50,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
            }
        }
    });

    // Save the model
    await model.save('file://./model'); // Saves model in the current directory
    console.log("Model saved successfully!");
})();
