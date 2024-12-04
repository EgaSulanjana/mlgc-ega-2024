const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
require("dotenv").config();

const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);

async function storeData(id, data) {
  try {
    const db = new Firestore({
      projectId: "submissionmlgc-egasulanjana",
      keyFilename: pathKey,
    });

    const predictCollection = db.collection("predictions");
    await predictCollection.doc(id).set(data);
    console.log("Data prediksi berhasil disimpan.");
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    throw new Error("Gagal menyimpan data prediksi ke Firestore.");
  }
}

module.exports = storeData;
