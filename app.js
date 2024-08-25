const express = require('express');
const app = express();
const {getTopics, endpoints, getArticleById} = require("./controllers/api.controller")
const {customErrorHandler, serverErrorHandler, psqlErrorHandler} =require('./errors')


app.get('/api/topics', getTopics)
app.get('/api', endpoints) 
app.get('/api/articles/:article_id', getArticleById);

app.use(customErrorHandler)
app.use(psqlErrorHandler)
app.use(serverErrorHandler)

app.use((err, req, res, next) => {
    if (err.code === "23502") {
      res.status(400).send({msg: "Bad request" });
    } else {
      next(err)
    }
  });

module.exports = app;