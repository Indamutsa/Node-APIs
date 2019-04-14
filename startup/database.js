const winston = require('winston');

//Importing mongoose for the database
const mongoose = require('mongoose');

const config = require('config');

module.exports = function () {
    //Connecting to the right database
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to ${db}...`));
}