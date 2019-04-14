//To get the settings of our application such as where it running, production or development
const config = require('config');

module.exports = function () {

    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}