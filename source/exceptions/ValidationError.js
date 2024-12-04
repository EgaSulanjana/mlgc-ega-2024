const CustomError = require("./customError");
class ValidationError extends CustomError {
  constructor(message) {
    super(message); // Memanggil parent class constructor
    this.name = "ValidationError"; // Mengatur nama custom error
  }
}
module.exports = ValidationError;
