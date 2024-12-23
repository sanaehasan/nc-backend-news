exports.handlePSQLError = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "invalid type" });
  } else if (err.code === "42703") {
    response.status(400).send({ msg: "invalid query data" });
  } else if (err.code === "42601") {
    response.status(400).send({ msg: "invalid argument" });
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
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
};
