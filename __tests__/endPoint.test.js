const endPoint = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");

describe("EndPoint Test: /api", () => {
  test("Get: 200 with json format describing our apps endPoint", () => {
    request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoint).toEqual(endPoint);
      });
  });
  test("Get: 404 when end point does not exist", () => {
    request(app)
      .get("/lalala")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Endpoint does not exist");
      });
  });
});
