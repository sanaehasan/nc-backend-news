const express = require("express");
const { getEndpoint } = require("./controllers/endPoint");
const { getAlltopics } = require("./controllers/tpoicsController");
const {
  handlePSQLError,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors_handles");
const app = express();

app.get("/api", getEndpoint);
app.get("/api/topics", getAlltopics);
app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Endpoint does not exist" });
});
app.use(handlePSQLError);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
