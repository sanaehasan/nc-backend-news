const db = require("../db/connection.js");
const { fetchArticleById } = require("./articlesModel");
exports.fetchComments = (article_id) => {
  let quertystr = "SELECT * FROM comments";

  if (article_id) {
    quertystr += " WHERE article_id=$1 ORDER BY created_at DESC";

    return Promise.all([
      db.query(quertystr, [article_id]),
      fetchArticleById(article_id),
    ]).then((result) => {
      return result[0].rows;
    });
  }
  return db.query(quertystr + " ORDER BY created_at DESC").then(({ rows }) => {
    return rows;
  });
};
