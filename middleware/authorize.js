const jwt = require('jsonwebtoken');
const config = require('config');

//This is middleware, when it successful, then will it only call the next middleware, otherwise the request
// shall hang on
//-----------------------------------------------This is like logging in ---------------------------
module.exports = function (req, res, next) {

    //We retrieve the token stored in x-auth-token in the incoming header of the request
    const token = req.header('x-auth-token');

    if (!token)
        return res.status(401).send('Access denied. No token provided.');

    try {
        //We add the token to the request object after verifying it against 
        //the secret key stored in env variables
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;

        //Here we call next() to call the next middleware, if you dont it will hang
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}