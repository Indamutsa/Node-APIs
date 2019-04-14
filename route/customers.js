const express = require('express');
const router = express.Router();
const Joi = require('joi');


const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find()
        .sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {

    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //  Match it to the schema
        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });

        console.log(req.body);
        customer = await customer.save();

        //Send it to the client
        res.send(customer);

    } catch (error) {
        console.log(error);
    }


})

router.put('/:id', async (req, res) => {
    try {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let customer = await Customer.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            }, {
                new: true //To return the updated value
            });

        if (!customer) return res.status(404).send('The customer with the given ID does not exist');

        //Send it to the client
        res.send(customer);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {

    try {
        let customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) return res.status(404).send('The customer with the given ID does not exist');

        //Send it to the client
        res.send(customer);

    } catch (error) {
        console.log(error);
    }


});

router.get('/:id', (req, res) => {

    try {
        let customer = Customer.findById(req.params.id)
        if (!customer) return res.status(404).send('The customer with the given ID does not exist');

        res.send(customer);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;