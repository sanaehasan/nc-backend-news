const express = require("express");
const { getEndpoint } = require("./controllers/endPoint");
const { getAlltopics } = require("./controllers/tpoicsController");
const app = express();

app.get("/api", getEndpoint);
app.get("/api/topics", getAlltopics);
app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Endpoint does not exist" });
});
module.exports = app;
