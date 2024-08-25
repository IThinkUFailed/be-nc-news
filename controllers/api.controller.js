const { end } = require("../db/connection");
const {selectTopics,serveApi} = require("../models/api.model")
// const {errorHandlers} = require('../errors')

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    })
}

exports.endpoints = (req, res, next) => {
    const endpoints = require('../endpoints.json'); // require automatically parses
    res.status(200).json(endpoints)
}