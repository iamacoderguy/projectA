const config = require('config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret = config.get('jwtPrivateKey');
const networkHelper = require('../helpers/networkHelper');

function Client(ipAddr) {
    this.id = encrypt(ipAddr);
    this.isAdmin = networkHelper.isFromLocalhost(ipAddr);
    this.expCode = NaN;
}

function encrypt(str) {
    const cipher = crypto.createCipher('aes-256-cbc', secret);
    let encryptedStr = cipher.update(str, 'utf-8', 'hex');
    encryptedStr += cipher.final('hex');

    return encryptedStr;
}

function decrypt(encryptedStr) {
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    var str = decipher.update(encryptedStr, 'hex', 'utf-8');
    str += decipher.final('utf-8');

    return str;
}

Client.prototype.generateAuthToken = function () {
    const token = jwt.sign(
        JSON.parse(JSON.stringify(this)),
        secret,
        { expiresIn: '15m' }
    );

    return token;
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
    return decrypt(this.id);
}

Client.prototype.getStatus = function() {
    return Object.is(this.expCode, NaN) ? "disconnected" : "connecting";
}

module.exports = Client;