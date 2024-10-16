const format = require("pg-format");
const db = require("../db/connection.js");
const { fetchArticleById } = require("./articlesModel");

exports.fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "DESC"
) => {
  let quertystr = "SELECT * FROM comments";
  const orderBy = `  ORDER BY ${sort_by} ${order}`;

  if (article_id) {
    quertystr += " WHERE article_id=$1" + orderBy;
    return Promise.all([
      db.query(quertystr, [article_id]),
      fetchArticleById(article_id),
    ]).then((result) => {
      return result[0].rows;
    });
  }

  return db.query(quertystr + orderBy).then(({ rows }) => {
    return rows;
  });
};

exports.writeComment = (article_id, comment) => {
  console.log(comment);
  const querystr = format(
    "INSERT INTO comments (body,votes,author,created_at,article_id) VALUES %L",
    comment
  );

  return Promise.all([fetchArticleById(article_id), db.query(querystr)]).then(
    (result) => {
      console.log(result);
    }
  );
};
