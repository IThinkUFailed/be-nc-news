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
                expect(topic).toHaveProperty("slug", expect.any(String));
                expect(topic).toHaveProperty("description", expect.any(String));
            });
        })
    })
    describe("/api", () => {
        test("Responds with status 200 and serves json file", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: data })=>{
                    expect(Object.keys(data).length).not.toBe(0);
                    expect(typeof data).toBe('object');
                           });
            })
        })    
})