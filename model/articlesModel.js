const db = require("../db/connection.js");

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const queryArray = [];
  let queryStr = `SELECT 
                 a.title,
                 a.article_id,
                 a.topic, 
                 a.created_at,
                 a.votes,
                 a.article_img_url, 
                 a.author,
                 COUNT(comment_id) as comments_count 
                 FROM articles a JOIN comments c ON a.article_id=c.article_id 
                 `;
  if (topic) {
    queryStr += ` WHERE a.topic='${topic}'`;
    queryArray.push(db.query("SELECT * FROM topics WHERE slug =$1", [topic]));
  }
  queryStr += ` GROUP BY a.article_id`;
  const orderby = ` ORDER BY ${sort_by} ${order}`;
  queryStr += orderby;
  queryArray.push(db.query(queryStr));
  return Promise.all(queryArray).then((result) => {
    if (result.length === 2 && result[0].rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return result[result.length - 1].rows;
  });
};

exports.patchArticelVotes = (vote, article_id) => {
  return db
    .query(
      `UPDATE articles 
      SET votes=votes+${vote}
      WHERE article_id=$1 
      RETURNING *`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
