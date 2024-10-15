const { fetchComments } = require("../model/commentsModel");

exports.getCommentsByArticleId = (request, response, next) => {
  return fetchComments(request.params.article_id)
    .then((comments) => {
      if (comments.length === 0) {
        response.status(200).send({ msg: "Article has no comments yet" });
      }
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};
