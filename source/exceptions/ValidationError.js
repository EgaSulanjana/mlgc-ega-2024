const CustomError = require("./customError");
class ValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
module.exports = ValidationError;
