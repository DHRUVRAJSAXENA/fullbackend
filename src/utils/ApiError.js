class ApiError extends Error {
  constructor(
    message = "Something went worng",
    statusCode,
    statck = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.status = false;
    this.errors = errors;

    if (statck) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
