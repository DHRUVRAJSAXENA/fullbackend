const asynHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asynHandler;

// const asynHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req,res,next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };
