//Used for input validation, it returns a class
const Joi = require('joi');

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
}