const winston = require('winston');

module.exports = function (err, req, res, next) {
    //Log the exception
    // winston.log('error', err.message); //or
    winston.error(err.message, err); //if you pass in err as the second, it will log as metadata (err.message, err)

    //error
    //warn
    //info
    //verbose
    //debug
    //silly

    res.status(500).send('Something failed, Please check the error below: \n' + err);
}