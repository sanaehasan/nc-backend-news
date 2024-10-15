const { fetchArticleById, fetchArticles } = require("../model/articlesModel");

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
  return fetchArticles()
    .then((articles) => {
      return response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
