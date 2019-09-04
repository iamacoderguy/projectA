const authHelper = require('../helpers/authHelper');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const verifyErr = authHelper.verify(ipAddr, token);
    if (verifyErr) {
        res.status(401)
            .json(verifyErr)
            .send();
    } else {
        next();
    }
}