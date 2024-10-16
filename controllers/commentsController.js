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

  const data = request.body.body;
  if (Object.keys(data).length === 0) {
    return response.status(400).send({ msg: "comment data is empty" });
  }
  data.author = request.body.username;
  data.created_at = new Date(data.created_at);
  data.article_id = article_id;

  writeComment(article_id, data)
    .then((comment) => {
      response.status(201).send({ comment: comment[0] });
    })
    .catch((err) => {
      next(err);
    });
};
