const db = require("../db/connection");
const fs = require("fs/promises")
const endpoints = require('../endpoints.json');

exports.selectTopics = () => {
return db.query(`SELECT * FROM topics;`).then((result)=>{
    // console.log(result.rows)
    return result.rows
})
}

exports.selectArticleById = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        console.log(result.rows)
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'article does not exist'
          })
        }
        return result.rows[0];
      });
    }