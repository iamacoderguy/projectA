const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    setTimeout(() => {
        res.send('Hello, world!');
    }, 1000);
});

module.exports = router; 
