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
        secret
    );

    const pin = pinHelper.getPin();
    const encryptedToken = encrypt(token, pin.toString());

    return encryptedToken;
}

Client.prototype.verifyToken = function (token) {
    try {
        const pin = pinHelper.getPin();
        const decryptedToken = decrypt(token, pin.toString());
        const decoded = jwt.verify(decryptedToken, secret);

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
                details: { expected: 'connecting', actual: 'disconnected' }
            }
        }

        if (decoded.expCode !== this.expCode) {
            return {
                name: 'TokenOutOfDateError',
                message: 'Your token is out-of-date. Please use the latest token.',
                details: { expected: this.expCode, actual: decoded.expCode }
            }
        }

        if (decoded.expCode < Date.now()) {
            return {
                name: 'ConnectionExpiredError',
                message: 'Your connection is expired. Please make a new connection.'
            }
        }

        return null;
    } catch (err) {
        if (err.message && err.message.indexOf('bad decrypt') !== -1) {
            return {
                name: 'IncorrectPasscodeError',
                message: 'pin is changed'
            }
        }
        return err;
    }
}

Client.prototype.createNewSession = function(expiresInMilliseconds) {
    this.expCode = !expiresInMilliseconds ? (Date.now() + 15*60*1000) : (Date.now() + expiresInMilliseconds);
}

Client.prototype.cleanAllSessions = function() {
    this.expCode = NaN;
}

Client.prototype.getIpAddr = function() {
    return decrypt(this.id, secret);
}

Client.prototype.getStatus = function() {
    if (Object.is(this.expCode, NaN)) {
        return 'disconnected';
    }
    
    if (this.expCode < Date.now()) {
        return 'expired';
    }
    
    return 'connecting';
}

module.exports = Client;