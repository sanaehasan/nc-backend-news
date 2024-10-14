const { fetchArticleById } = require("../model/articlesModel");

exports.getArticleByID = (request, response, next) => {
  return fetchArticleById(request.params.article_id)
    .then((article) => {
      return response.status(200).send({ article: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};
