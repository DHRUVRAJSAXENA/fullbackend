import { asynHandler } from "../utils/asynHandler.js";

const healthCheck = asynHandler(async (req, res) => {
  const healthCheckResponse = {
    status: "OK",
    message: "Server is running properly",
    timestamp: new Date(),
  };

  return res.status(200).json(200, healthCheckResponse, "healthCheckUp Done");
});
