const config = require('config');
const debug = require('debug')('servera:index');
const morgan = require('morgan');
const express = require('express');
const app = express();

debug(config.get('name'));

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    debug('Listening on port 3000...');
})