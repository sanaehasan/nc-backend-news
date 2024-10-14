const endpoint = require("../endpoints.json");

exports.getEndpoint = (request, response) => {
  return response.status(200).send({ endpoint: endpoint });
};
