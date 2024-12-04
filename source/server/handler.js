const predictClassification = require("../service/inferenceService");
const crypto = require("crypto");
const storeData = require("../service/storeData");
const path = require("path");
const { Firestore } = require("@google-cloud/firestore");
require("dotenv").config();

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { confidenceScore, label, suggestion } = await predictClassification(
    model,
    image
  );

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);
  return h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    })
    .code(201);
}

const predictHistories = async (_request, h) => {
  try {
    const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);

    const db = new Firestore({
      projectId: "submissionmlgc-egasulanjana",
      keyFilename: pathKey,
    });

    const snapshot = await db.collection("predictions").get();

    if (snapshot.empty) {
      return h
        .response({
          status: "success",
          data: [],
        })
        .code(200);
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: {
        result: doc.data().result,
        createdAt: doc.data().createdAt,
        suggestion: doc.data().suggestion,
        id: doc.id,
      },
    }));

    return h
      .response({
        status: "success",
        data,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: "fail",
        message: error.message || "Internal Server Error",
      })
      .code(500);
  }
};

module.exports = { postPredictHandler, predictHistories };
