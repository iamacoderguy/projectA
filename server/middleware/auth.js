const authHelper = require('../helpers/authHelper');
const networkHelper = require('../helpers/networkHelper');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    
    const ipAddr = networkHelper.getIpAddressFromReq(req);
    const verifyErr = authHelper.verify(ipAddr, token);
    if (verifyErr) {
        res.status(401)
            .json(verifyErr)
            .send();
    } else {
        next();
    }
}