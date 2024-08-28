const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());
describe("/api/topic", () => {
  test("Responds with status 200 and an array containing data for all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  describe("/api", () => {
    test("Responds with status 200 and serves json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: data }) => {
          expect(Object.keys(data).length).not.toBe(0); // this is how we search through an object to make sure its not empty
          expect(typeof data).toBe("object");
          expect(data).toEqual(endpoints);
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("Sends an article to the client", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const expectedOutput = {
            article: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          };
          expect(response.body).toEqual(expectedOutput);
        });
    });
    test("Sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });
    test("Sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });
  describe("/api/articles", () => {
    test("sends all articles to the client", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).not.toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String)); // I thought this would be a number
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("sends all comments to the user based on an article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          });
        });
    });
    test("Sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });
  });
  test("Sends an appropriate status and error message when provided invalid data type on comments", () => {
    return request(app)
      .get("/api/articles/ninety/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("Should POST comment and return inserted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "test",
          username: "butter_bridge",
        })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("author", "butter_bridge");
        });
    });
    test("Should attempt to POST comment and return 404 error when supplying valid user but invalid article id", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({
          body: "test",
          username: "butter_bridge",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test("Should attempt to POST comment and return 403 error when supplying an invalid user but valid article id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "test",
          username: "lard_bridge",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    test("Should attempt to POST comment and return 404 error when supplying invalid user but invalid article id", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({
          body: "test",
          username: "lard_bridge",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
  });
  describe("PATCH: /api/articles/:article_id", () => {
    test("Should update an articles votes to be higher", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: 100,
        })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          const original = {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("votes", 200);
          expect(article.title).toEqual("Living in the shadow of a great man");
          expect(article.topic).toEqual("mitch");
          expect(article.author).toEqual("butter_bridge");
          expect(article.body).toEqual("I find this existence challenging");
          expect(article.created_at).toEqual("2020-07-09T20:11:00.000Z");
          expect(article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article).not.toEqual(original);
        });
    });
    test("Should lower an articles votes by 100 by article_id ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -100,
        })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          const original = {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("votes", 0);
          expect(article.title).toEqual("Living in the shadow of a great man");
          expect(article.topic).toEqual("mitch");
          expect(article.author).toEqual("butter_bridge");
          expect(article.body).toEqual("I find this existence challenging");
          expect(article.created_at).toEqual("2020-07-09T20:11:00.000Z");
          expect(article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article).not.toEqual(original);
        });
    });
    test("Should return a 404 if the article is not found", () => {
      return request(app)
        .patch("/api/articles/199")
        .send({
          inc_votes: 100,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });
    test("Should return a 500 error if invalid data type", () => {
      return request(app)
        .patch("/api/articles/19e9")
        .send({
          inc_votes: 100,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("Should lower an articles votes by 1000 for article 1 causing it to respond with -900", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -1000,
        })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          const original = {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("votes", -900);
          expect(article.title).toEqual("Living in the shadow of a great man");
          expect(article.topic).toEqual("mitch");
          expect(article.author).toEqual("butter_bridge");
          expect(article.body).toEqual("I find this existence challenging");
          expect(article.created_at).toEqual("2020-07-09T20:11:00.000Z");
          expect(article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article).not.toEqual(original);
        });
    });
  });
});
