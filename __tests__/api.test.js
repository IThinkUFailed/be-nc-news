const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index")

beforeEach(() => seed(data));
afterAll(() => db.end());
describe("/api/topic", () => {
    test("Responds with status 200 and an array containing data for all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } })=>{
            expect(topics.length).toBe(3);
            topics.forEach(topic => {
                expect(topic).toHaveProperty("slug", expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String))
            });
        })
    })
    describe("/api", () => {
        test("Responds with status 200 and serves json file", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: data })=>{
                    expect(Object.keys(data).length).not.toBe(0) // this is how we search through an object to make sure its not empty
                    expect(typeof data).toBe('object');
                           });
            })
        }) 
        describe('/api/articles/:article_id', () => {
            test('Sends an article to the client', () => {
              return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then((response) => {
                    // console.log(response)
                    expect(response.body.article).toHaveProperty("author", expect.any(String))
                    expect(response.body.article).toHaveProperty("title", expect.any(String))
                    expect(response.body.article).toHaveProperty("article_id", expect.any(Number))
                    expect(response.body.article).toHaveProperty("body", expect.any(String))
                    expect(response.body.article).toHaveProperty("topic", expect.any(String))
                    expect(response.body.article).toHaveProperty("created_at", expect.any(String))
                    expect(response.body.article).toHaveProperty("votes", expect.any(Number))
                    expect(response.body.article).toHaveProperty("article_img_url", expect.any(String))
                    
                });
            });
            test('Sends an appropriate status and error message when given a valid but non-existent id', () => {
              return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then((response) => {
                  expect(response.body.msg).toBe('article does not exist');
                });
            });
            test('Sends an appropriate status and error message when given an invalid id', () => {
              return request(app)
                .get('/api/articles/invalid')
                .expect(400)
                .then((response) => {
                  expect(response.body.msg).toBe('Bad request');
                });

            });   
        })
describe('/api/articles', () => {
  test.only('sends all articles to the client', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article)=>{ 
            expect(article).toHaveProperty("author", expect.any(String))
            expect(article).toHaveProperty("title", expect.any(String))
            expect(article).toHaveProperty("article_id", expect.any(Number))
            expect(article).not.toHaveProperty("body", expect.any(String))
            expect(article).toHaveProperty("topic", expect.any(String))
            expect(article).toHaveProperty("created_at", expect.any(String))
            expect(article).toHaveProperty("votes", expect.any(Number))
            expect(article).toHaveProperty("article_img_url", expect.any(String))
            expect(article).toHaveProperty("comment_count", expect.any(String)) // I thought this would be a number
          })
            
      });
  })
})})