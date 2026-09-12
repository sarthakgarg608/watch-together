// ------------------------------------------------------
// Standard API Response
//
// Keeps successful API responses consistent throughout
// the application.
// ------------------------------------------------------

class ApiResponse {
  constructor(
    statusCode,
    data = null,
    message = "Success"
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;