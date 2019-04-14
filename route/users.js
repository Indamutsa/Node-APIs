const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate } = require('../models/user');
const authorize = require('../middleware/authorize');

//Getting the current user
router.get('/:me', authorize, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch (error) {
        console.log(error);
    }

})

//-------------------------------------------Registration of a new user --------------------
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Make sure he is not already registered
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');


        //A better with lodash _
        // user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });

        user = new User(_.pick(req.body, ['name', 'email', 'password']));

        //Generating a salt to strengthen our password
        const salt = await bcrypt.genSalt(10);

        //Hashing the password
        user.password = await bcrypt.hash(user.password, salt);

        //Saving the user
        await user.save();

        //Generating the token
        const token = user.generateAuthToken();

        let objClient = _.pick(user, ['name', 'email']);
        console.log(user);

        // //Send it to the client ==> To avoid sending the password to the user
        // res.send(//{ name: user.name, email: user.email }
        //     objClient
        // );

        //We send the token to the user in the header with some chosen details (objClient)
        res.header('x-auth-token', token).send(_.pick(user, objClient))

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;