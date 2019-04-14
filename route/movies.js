const express = require('express');
const router = express.Router();

const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
            .sort('name');
        res.send(movies);
    } catch (error) {
        console.log(error);
    }

});

router.post('/', async (req, res) => {

    try {
        console.log(req.body);
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        console.log("===>>  " + req.body.title);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');

        //Match it to the schema and save it in object
        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();

        //Send it to the client
        res.send(movie);
        console.log(movie);


    } catch (error) {
        console.log(error);
    }


})

router.put('/:id', async (req, res) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let movie = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: req.body.name,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }, {
                new: true //To return the updated value
            });

        if (!movie) return res.status(404).send('The movie with the given ID does not exist');

        //Send it to the client
        res.send(movie);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {

    try {
        let movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('The customer with the given ID does not exist');

        //Send it to the client
        res.send(movie);

    } catch (error) {
        console.log(error);
    }


});

router.get('/:id', (req, res) => {

    try {
        let movie = Movie.findById(req.params.id)
        if (!movie) return res.status(404).send('The customer with the given ID does not exist');

        res.send(movie);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;