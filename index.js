const express = require('express');

//express as an object with http methods
const app = express(); //we calling it as module now

//call winston and replace it with any log
const winston = require('winston');

//Importing the loggging
const logging = require('./startup/logging');

//Importing the startup file 
const startup = require('./startup/routes');

//Importing the db
const mongo = require('./startup/database');

const config = require('./startup/config');

const validation = require('./startup/validation');

//Logging
logging();

//Starting the app with all dependencies involved
startup(app);

//Starting the database
mongo();

//Execute the configuration => Getting environments for to configure tokens
config();

//Execute validation
validation();

//PORT, We define a port like this. The proper way to assign a port to an app
const port = process.env.PORT || 3000;

//Making the app listen to given port
const server = app.listen(port, () => { winston.info(`Listening on port ${port}...`); });

module.exports = server;
