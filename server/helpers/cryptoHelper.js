const crypto = require('crypto');

module.exports.encrypt = function(str, secret) {
    const cipher = crypto.createCipher('aes-256-cbc', secret);
    let encryptedStr = cipher.update(str, 'utf-8', 'hex');
    encryptedStr += cipher.final('hex');

    return encryptedStr;
}

module.exports.decrypt = function(encryptedStr, secret) {
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    var str = decipher.update(encryptedStr, 'hex', 'utf-8');
    str += decipher.final('utf-8');

    return str;
}