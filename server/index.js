const config = require('config');
const morgan = require('morgan');
const express = require('express');
const app = express();

console.log(config.get('name'));

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})