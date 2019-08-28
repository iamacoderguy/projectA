const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('first_view', { pageTitle: 'hello, world!', youAreUsingPug: true });
});

module.exports = router; 
