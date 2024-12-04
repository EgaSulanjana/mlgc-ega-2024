const tf = require("@tensorflow/tfjs-node");
const ValidationError = require("../exceptions/ValidationError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

    let suggestion = "";
    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else if (label === "Non-cancer") {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    } else {
      suggestion = "Anda Sehat!";
    }
    console.log("Skor Prediksi: ", score);
    console.log("Skor Kepercayaan: ", confidenceScore);

    return {
      confidenceScore,
      label,
      suggestion,
    };
  } catch (error) {
    throw new ValidationError("Terjadi kesalahan dalam melakukan prediksi.");
  }
}

module.exports = predictClassification;
