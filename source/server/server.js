require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const loadModel = require("../service/loadModel");
const ValidationError = require("../exceptions/ValidationError");
(async () => {
  try {
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: process.env.HOST || "localhost",
      routes: {
        cors: {
          origin: ["*"],
        },
      },
    });
    const model = await loadModel();
    server.app.model = model;
    server.route(routes);
    server.ext("onPreResponse", function (request, h) {
      const response = request.response;

      if (response instanceof ValidationError) {
        const newResponse = h.response({
          status: "fail",
          message: `Terjadi kesalahan dalam melakukan prediksi`,
        });
        newResponse.code(400);
        return newResponse;
      }

      if (response.isBoom) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.output.statusCode);
        return newResponse;
      }

      return h.continue;
    });
    await server.start();
    console.log(`Server is running at ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();
