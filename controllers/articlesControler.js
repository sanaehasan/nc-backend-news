const {
  fetchArticleById,
  fetchArticles,
  patchArticelVotes,
} = require("../model/articlesModel");

exports.getArticleByID = (request, response, next) => {
  return fetchArticleById(request.params.article_id)
    .then((article) => {
      return response.status(200).send({ article: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  return fetchArticles(sort_by, order, topic)
    .then((articles) => {
      return response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.UpdateArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  return patchArticelVotes(request.body.inc_votes, article_id)
    .then((article) => {
      return response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};
