const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');

//Login
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Make sure he is not already registered
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password');

        //This will compare
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword)
            if (!validPassword) return res.status(400).send('Invalid email or password');

        let token = user.generateAuthToken();
        res.send(token);

    } catch (error) {
        console.log(error);
    }
});

//Function to validate
function validate(req) {
    let schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;