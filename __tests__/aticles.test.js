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
    test("Get:200 response with article object that has the id 1", () => {
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
    test("Get:404 when passed a valid id which is not present in the dataBase", () => {
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
  describe("Update article", () => {
    describe("Update article's votes", () => {
      test("Patch:200 vote should increase by 2", () => {
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
            expect(body.msg).toBe("invalid query data");
          });
      });
      test("Patch:400 when passed invalid article_id value", () => {
        const vote = { inc_votes: 2 };
        return request(app)
          .patch("/api/articles/invalid")
          .send(vote)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid type");
          });
      });
      test("Patch:404 when passed non existant articla_id", () => {
        const vote = { inc_votes: 2 };
        return request(app)
          .patch("/api/articles/9999")
          .send(vote)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
    });
  });
  describe("Get All Articles with query arguments", () => {
    test("Get:200 all articles objects in the database exclusing the body and with a comments count", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "article_id", order: "ASC" })
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
    test("Get:200 all articles sorted by date DESC", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "article_id", order: "ASC" })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "article_id",
          });
        });
    });
    test("Get:400 bad request when sort_by argument is non existant in the database", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "invalid", order: "ASC" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid query data");
        });
    });
    test("Get:400 bad request when order argument is invalid", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "article_id", order: "invalid" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid argument");
        });
    });
  });
  test("Get:200 test other query are ingored", () => {
    return request(app)
      .get("/api/articles")
      .query({ getBy: "article_id" })
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
      });
  });

  test("Get:200 all articles objects in the database that has topic", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "mitch" })
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(4);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("Get:404  when topic does not exist", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "sanae" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Articles not found");
      });
  });
  test("Get:200  when topic exist but not linked to an article", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "paper" })
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
      });
  });

  describe("Get: get artcle by id with count of comments by article", () => {
    test("Get:200 response with article object that has the id 1 including the comments_count entry", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.hasOwnProperty("comments_count")).toBe(true);
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
            comments_count: "11",
          });
        });
    });
    test("Get:200 response with article that has not comments yet comment_count =0", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-07-09T20:11:00.000Z",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comments_count: "0",
          });
        });
    });
  });
});
