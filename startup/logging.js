//Used for logging
const winston = require('winston'); //winston 2.4
require('winston-mongodb');

//Module to handle async error | alternative to the asyncCatch function
require('express-async-errors');

//To avoid console.log message, we use debug
const debug = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

module.exports = function () {

    //Make the logs prettier
    new winston.transports.Console({ colorize: true, prettyPrint: true });

    //This can only catch errors that happens in the express context
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly',
        level: 'error' //Only the error will logged, not info, warn or debug
    });

    //Catching the exception anywhere | Manually
    process.on('uncaughtException', (exception) => {
        console.log('We got an uncaught exception');
        winston.error(exception.message, exception);
        process.exit(1);
    });
    //Uncomment this to simulate exception outside expression context. It is only applied on synchronous execution
    // throw new Error('Failed during startup');

    process.on('unhandledRejection', (exception) => {
        console.log('We got an unhandled exception');
        winston.error(exception.message);
        process.exit(1);
    });

    //Simulating unhandleREjection
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => console.log('Done'));
}