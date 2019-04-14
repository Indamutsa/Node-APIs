const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');

const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

//It will help us perform a transaction
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
            .sort('-dateout');
        res.send(movies);
    } catch (error) {
        console.log(error);
    }

});

router.post('/', async (req, res) => {

    try {
        console.log(req.body)
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid customer.');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie.');

        console.log(movie);

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

        //Match it to the schema
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        console.log(rental);

        //This ensures a transaction. both moves and rental will commit or neither will.
        try {
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', { _id: movie._id },
                    {
                        $inc: { numberInStock: -1 }
                    })
                .run();

            //Send it to the client
            res.send(rental);

        } catch (error) {
            res.status(500).send('Internal server failed')
        }




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