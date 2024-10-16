const { convertTimestampToDate } = require("../db/seeds/utils");
const { fetchComments, writeComment } = require("../model/commentsModel");

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

exports.addComment = (request, response, next) => {
  const { article_id } = request.params;
  const data = request.body;
  data.created_at = Date(Date.now());
  data.article_id = article_id;
  writeComment(article_id, data)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
