const db = require("../db/connection");
const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.postComment = (article_id, body, username) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING*;`,
      [body, username, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return db
        .query(
          `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING*;`,
          [body, username, article_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};

exports.getAllArticles = () => {
  return db
    .query(
      `
    SELECT articles.article_id, 
       articles.title, 
       articles.author, 
       articles.topic, 
       articles.created_at, 
       articles.votes, 
       articles.article_img_url, 
       COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.retrieveCommentsById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return db.query(
        `
            SELECT comment_id, 
                   votes, 
                   created_at, 
                   author, 
                   body, 
                   article_id
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;
          `,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      // console.log(result.rows)
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      }
      return result.rows[0];
    });
};
