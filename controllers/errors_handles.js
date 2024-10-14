exports.handlePSQLError = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "invalid article_id value" });
  } else {
    next(err);
  }
};
exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
