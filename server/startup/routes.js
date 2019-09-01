const client = require('../routes/client');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use('/', client);
    app.use(error);
}