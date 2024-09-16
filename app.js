const express = require('express');
const app = express();
const {getTopics, endpoints, getArticleById, getArticles, getArticleComments, addComment, updateArticle, delComment,getUsers} = require("./controllers/api.controller")
const {customErrorHandler, serverErrorHandler, psqlErrorHandler} = require('./errorHandler')
app.use(express.json())
const cors = require('cors');
app.use(cors());

app.get('/api', endpoints) 
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments);
app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', addComment);

app.patch('/api/articles/:article_id', updateArticle)

app.delete('/api/comments/:comment_id', delComment);

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