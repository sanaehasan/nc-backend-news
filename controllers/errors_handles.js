exports.handlePSQLError = (err, request, response, next) => {};
exports.handleCustomErrors = (err, request, response, next) => {};
exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
