const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

//We adding a method to the object itself to generate a token || pretty much we are adding a token on the 
//object ===> Object oriented INFORMATION EXPERT principle: The expert, all the one with enough information
//should be the one to do the operation
userSchema.methods.generateAuthToken = function () {
    //Generating the token, adding the salt, or secret key

    //It takes: 
    //     var token = jwt.sign(payload, privateKEY, signOptions)
    //           1) The payload it will use to hash
    //           2) The private key
    //           3) The options such as expiration time


    //These are the signOptions
    //--------------------------
    /*issuer — Software organization who issues the token.
      subject — Intended user of the token.
      audience — Basically identity of the intended recipient of the token..
      expiresIn — Expiration time after which the token will be invalid.
      algorithm — Encryption algorithm to be used to protect the token*/

    const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
//The model
const User = mongoose.model('Users', userSchema);

//Function to validate
function validateUser(user) {
    let schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;