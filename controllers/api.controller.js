// const { end } = require("../db/connection");
const {selectTopics,selectArticleById, getAllArticles} = require("../models/api.model")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    }).catch((err)=> {
        console.log(err)
        next(err)
})}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch((err)=> {
      next(err)
    })
  };

  exports.getArticles = (req, res, next) => {
    getAllArticles().then((articles)=>{
        res.status(200).send({articles})
    }).catch((err)=> {
        console.log(err)
        next(err)
})}

exports.endpoints = (req, res, next) => {
    const endpoints = require('../endpoints.json'); // require automatically parses
    res.status(200).json(endpoints)
} // this does not need an error block as it can only ever respond on this end point
