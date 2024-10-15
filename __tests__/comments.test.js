const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});

describe("Comments End Point", () => {
  describe("Get:200 status Comments by article_id", () => {
    test("Get:200 all comments by article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.article_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.created_at).toBe("string");
          });
        });
    });
    test("Get:400 when the article_id is invalid type", () => {
      return request(app)
        .get("/api/articles/invalid/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id type");
        });
    });
    test("Get:404 when the article_id is valid type but not present in the database", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("Get:200 when the article_id is valid but no comments linked to that id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe("Article has no comments yet");
        });
    });
  });
});
