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

describe("Articles End Point", () => {
  describe("Get Article by Id", () => {
    test("GET:200 response with article object that has the id 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET:404 when passed a valid id which is not present in the dataBase", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("GET:400 when passed invalid article_id value", () => {
      return request(app)
        .get("/api/articles/something")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid type");
        });
    });
  });
  describe("Get All Articles", () => {
    test("Get all articles objects in the database exclusing the body and with a comments count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(5);
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comments_count).toBe("string");
            expect(article.body).toBeUndefined();
          });
        });
    });
    test("Get all articles sorted by date DESC", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
  });
  describe("Patch:200 update article", () => {
    describe("Patch:200 update article's votes", () => {
      test("vote should increase by 2", () => {
        const vote = { inc_votes: 2 };
        return request(app)
          .patch("/api/articles/1")
          .send(vote)
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 102,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
            expect(body.article.votes).toBe(102);
          });
      });
      test("Patch:400 when passed invalid votes value", () => {
        const vote = { inc_votes: "invalid" };
        return request(app)
          .patch("/api/articles/1")
          .send(vote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid data type");
          });
      });
    });
  });
});
