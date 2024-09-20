const db = require("../db/connection");
const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

exports.patchArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return result.rows[0];
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
      return result.rows[0];
    });
};

exports.getAllArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  const queryVal = []
  let validColumns = [
    "article_id",
    "comment_count",
    "title",
    "topic",
    "author",
    "votes",
    "created_at",
    "article_img_url",
  ];

  let queryStr = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`

  let validOrder = ["ASC", "DESC", "asc", "desc"];
  if (!validColumns.includes(sort_by) || !validOrder.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
  order_by = order_by.toUpperCase()
if (topic) {
  queryStr += " WHERE topic = $1"
 queryVal.push(topic)
}
console.log(queryStr)
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by};`

  return db
    .query(queryStr, queryVal)
    .then((result) => {
      return result.rows;
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return;
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
