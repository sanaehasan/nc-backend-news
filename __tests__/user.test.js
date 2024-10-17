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

describe("User End point", () => {
  describe("GET: get user", () => {
    test("GET:200 get all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
    test("GET:404 wrong end point", () => {
      return request(app)
        .get("/api/useerss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Endpoint does not exist");
        });
    });
  });
});
