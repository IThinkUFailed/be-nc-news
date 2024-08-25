const express = require('express');
const app = express();
const {getTopics, endpoints} = require("./controllers/api.controller")

app.get('/api/topics', getTopics)
app.get('/api', endpoints)
module.exports = app;