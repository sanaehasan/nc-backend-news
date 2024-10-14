const { fetchAllTopics } = require("../model/topicsModel");

exports.getAlltopics = (request, response, next) => {
  return fetchAllTopics()
    .then((topicsData) => {
      return response.status(200).send({ topics: topicsData });
    })
    .catch((err) => {
      next(err);
    });
};
