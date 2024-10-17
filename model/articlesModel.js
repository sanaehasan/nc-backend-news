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

exports.fetchArticles = (sort_by = "created_at", order = "DESC") => {
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
                 GROUP BY  a.article_id`;
  //here will come other query items WHERE
  const orderby = ` ORDER BY ${sort_by} ${order}`;
  queryStr += orderby;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
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
      return rows[0];
    });
};
