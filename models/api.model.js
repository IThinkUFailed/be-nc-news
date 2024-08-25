const db = require("../db/connection");
const fs = require("fs/promises")
const endpoints = require('../endpoints.json');

exports.selectTopics = () => {
return db.query(`SELECT * FROM topics;`).then((result)=>{
    // console.log(result.rows)
    return result.rows
})
}