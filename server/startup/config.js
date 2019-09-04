const debug = require('debug')('servera:config');
const config = require('config');

module.exports = function () {
    debug(config.get('name'));
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}