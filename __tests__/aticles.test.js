const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");

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
          expect(body.msg).toBe("invalid id type");
        });
    });
  });
  describe("Get All Articles", () => {
    test("Get all articles objects in the database", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
        });
    });
  });
});
