const express = require('express');
const router = express.Router();
const validateId = require('../middleware/validateObjectId');

const { Genre, validate } = require('../models/genre');
const authorize = require('../middleware/authorize');

//To ensure the user is admin
const admin = require('../middleware/isAdmin');

//Used to remove repetitive try and catch
const asyncMiddleware = require('../middleware/asyncCatch');


//Like this we remove the try catch block repetition
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//To make sure this is authorized before we proceed, we make it execute the middleware authorize
// before excuting the async function

//We can use asyncMiddleware to catch the async try catch issues or we use the module express-async-errors
router.post('/', authorize, asyncMiddleware(async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Match it to the schema
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    console.log(genre);

    //Send it to the client
    res.send(genre);
}));

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true //To return the updated value
    });

    if (!genre) return res.status(404).send('The genre with the given ID does not exist');

    //Send it to the client
    res.send(genre);

});

//He can delete if he is an authenticated user and he is an admin
router.delete('/:id', [authorize, admin], async (req, res) => {
    try {
        let genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) return res.status(404).send('The genre with the given ID does not exist');

        //Send it to the client
        res.send(genre);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', validateId, async (req, res) => {

    let genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID does not exist');

    res.send(genre);
});

module.exports = router;