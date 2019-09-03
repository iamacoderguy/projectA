const config = require('config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const db_ExpCodes = require('../models/db_ExpCodes');
const Client = require('../models/client');

function encrypt(str) {
    let encryptedStr = crypto
        .createHmac('sha256', config.get('jwtPrivateKey'))
        .update(str)
        .digest('hex');

    return encryptedStr;
}

function decrypt(encryptedStr) {
    let str = crypto
        .createHmac('sha256', config.get('jwtPrivateKey'))
        .update(encryptedStr)
        .digest('utf8');

    return str;
}

module.exports.verify = function (token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        const decryptedClient = new Client(decrypt(decoded.client.ipAddr));
        const validExpCode = db_ExpCodes.getExpCode(decryptedClient);

        if (decoded.expCode !== validExpCode) {
            return {
                name: 'TokenExpiredError',
                message: 'expCode expired',
                expCodes: { yourCode: expCode, validCode: validExpCode }
            }
        }

        return null;
    } catch (err) {
        return err;
    }
}

module.exports.generateAuthToken = function (client, expCode) {
    const encryptedClient = new Client(encrypt(client.ipAddr));
    const token = jwt.sign(
        {
            client: encryptedClient,
            expCode: expCode
        },
        config.get('jwtPrivateKey'),
        { expiresIn: '15m' }
    );

    return token;
}

module.exports.isConnected = function (client) {
    return !!db_ExpCodes.getExpCode(client.ipAddr);
}