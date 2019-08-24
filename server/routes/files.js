const express = require('express');
const router = express.Router();

// /api/files
/// GET - returns list of shared files
/// GET ./{filepath / filename / id} - returns the file
/// POST - push a file to server

router.get('/', (req, res) => {
    res.send('Returns the list of shared files');
});

module.exports = router;