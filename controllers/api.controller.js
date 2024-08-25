const {selectTopics} = require("../models/api.model")
// const {errorHandlers} = require('../errors')

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics)=>{
        res.status(200).send({topics})
    })
}