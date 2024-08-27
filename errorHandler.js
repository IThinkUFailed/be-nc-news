// This one responds with our custom message
exports.customErrorHandler = (err, req, res, next)=>{
    if (err.status) {
      res.status(err.status).send({ msg: err.msg});
    } else {
      next(err)
    }
}

exports.psqlErrorHandler = (err, req, res, next)=>{
if (err.code === "23502") {
    res.status(400).send({msg: "Bad request" });
  } else if (err.code === "22P02") {
        res.status(400).send({msg: "Bad request" });
    } else {
    next(err)
  }}

  // This one will respond for 500 internal errors
exports.serverErrorHandler = (err, req, res, next)=>{
    res.status(500).send({msg:'internal server error'})
    }