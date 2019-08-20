const debug = require('debug')('servera:config');
const config = require('config');

module.exports = function() {
    debug(config.get('name'));
}