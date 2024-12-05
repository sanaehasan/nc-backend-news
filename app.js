const express = require("express");
const { getEndpoint } = require("./controllers/endPoint");
const { getAlltopics } = require("./controllers/tpoicsController");
const cors = require("cors");
const {
  handlePSQLError,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors_handles");
const {
  getArticleByID,
  getArticles,
  UpdateArticleVotes,
  addArticle,
  deleteArticle,
  updateArticle,
} = require("./controllers/articlesControler");
const {
  getCommentsByArticleId,
  addComment,
  destroyCommentById,
} = require("./controllers/commentsController");
const { getUsers } = require("./controllers/usersController");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api", getEndpoint);
app.get("/api/topics", getAlltopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.post("/api/articles", addArticle);
app.patch("/api/article/:article_id", updateArticle);
app.delete("/api/articles/:article_id", deleteArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addComment);
app.patch("/api/articles/:article_id", UpdateArticleVotes);
app.delete("/api/comments/:comment_id", destroyCommentById);
app.get("/api/users", getUsers);
app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Endpoint does not exist" });
});
app.use(handlePSQLError);
app.use(handleCustomErrors);
app.use(handleServerErrors);
module.exports = app;
