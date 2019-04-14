//Separation of concerns


//This will return an object
const express = require('express'); //we are calling it as module now

//Used to parse json
const bodyParser = require('body-parser');


//Used to load in http request and give information about the request such the type, time it took and so on
const morgan = require('morgan');

//We calling the module but also we have to define its midddleware
const courses = require('../route/courses');
const genres = require('../route/genres');
const customers = require('../route/customers');
const movies = require('../route/movies');
const rentals = require('../route/rentals');
const users = require('../route/users');
const auth = require('../route/auth');
const error = require('../middleware/error');
const logger = require('../middleware/logger');




module.exports = function (app) {

    //----------------------------Built-in middleware in express----------------------
    //################################################################################

    //This is a middleware to enable json to be passed in the reqest body
    app.use(bodyParser.json()); //req.body
    app.use(bodyParser.urlencoded({ extended: true })); //to read x-form-urlencoded -- It concatenates the key 
    app.use(express.static('public'));

    //------------------------ Third party middleware in express----------------------
    //################################################################################
    app.use('/api/courses', courses);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    //Middleware to handle the errors.
    app.use(error); // we only pass in the function

}