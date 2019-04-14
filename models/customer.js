const mongoose = require('mongoose');
const Joi = require('joi');

//Create a schema
const customerSChema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false,

    },

    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

//Function to validate
function validateCustomer(customer) {
    let schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(customer, schema);
}

//The model
const Customer = mongoose.model('Customer', customerSChema);

exports.Customer = Customer;
exports.validate = validateCustomer;