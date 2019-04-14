function log(req, res, next) { //next references the next middleware in the pipeline
    console.log('Logging...'); // the middle of json will pass (req.body) here
    next();
}

module.exports = log;