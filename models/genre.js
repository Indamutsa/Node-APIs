const mongoose = require('mongoose');
const Joi = require('joi');

//Create a schema
const genreSChema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

//Function to validate
function validateGenre(genre) {
    let schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

//The model
const Genre = mongoose.model('Genre', genreSChema);

exports.genreSChema = genreSChema;
exports.Genre = Genre;
exports.validate = validateGenre;