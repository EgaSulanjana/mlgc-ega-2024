const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  try {
    // Memuat model TensorFlow dari URL
    return await tf.loadGraphModel(
      "https://storage.googleapis.com/bucket-model-mlgc/model/model.json"
    );
  } catch (error) {
    console.error("Gagal memuat model:", error);
    throw new Error("Gagal memuat model.");
  }
}

module.exports = loadModel;
