const config = require('config');
const secret = config.get('jwtPrivateKey');
const jwt = require('jsonwebtoken');
const networkHelper = require('../helpers/networkHelper');
const { encrypt, decrypt } = require('../helpers/cryptoHelper');
const pinHelper = require('../helpers/pinHelper');

function Client(ipAddr) {
    this.id = encrypt(ipAddr, secret);
    this.isAdmin = networkHelper.isFromLocalhost(ipAddr);
    this.expCode = NaN;
}

Client.prototype.generateAuthToken = function () {
    const token = jwt.sign(
        JSON.parse(JSON.stringify(this)),
        secret,
        { expiresIn: '15m' }
    );

    const pin = pinHelper.getPin();
    const encryptedToken = encrypt(token, pin);

    return encryptedToken;
}

Client.prototype.verifyToken = function (token) {
    try {
        const decoded = jwt.verify(token, secret);

        if (decoded.id !== this.id) {
            return {
                name: 'IdMismatchedError',
                message: 'id mismatched',
                details: { expected: this.id, actual: decoded.id }
            }
        }

        if (this.getStatus() === 'disconnected') {
            return {
                name: 'DisconnectedError',
                message: 'client disconnected',
                details: { expected: 'connected', actual: 'disconnected' }
            }
        }

        if (decoded.expCode !== this.expCode) {
            return {
                name: 'TokenExpiredError',
                message: 'expCode expired',
                details: { expected: this.expCode, actual: decoded.expCode }
            }
        }

        return null;
    } catch (err) {
        return err;
    }
}

Client.prototype.createNewSession = function() {
    this.expCode = Date.now();
}

Client.prototype.cleanAllSessions = function() {
    this.expCode = NaN;
}

Client.prototype.getIpAddr = function() {
    return decrypt(this.id, secret);
}

Client.prototype.getStatus = function() {
    return Object.is(this.expCode, NaN) ? "disconnected" : "connecting";
}

module.exports = Client;