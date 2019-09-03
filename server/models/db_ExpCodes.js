// this module one can be replaced by a db
const expCodes = [];

module.exports.setExpCode = function(client) {
    expCodes[client.ipAddr] = !expCodes[client.ipAddr] ? 0 : expCodes[client.ipAddr] + 1;
    return expCodes[client.ipAddr];
}

module.exports.getExpCode = function(client) {
    return !expCodes[client.ipAddr] ? 0 : expCodes[client.ipAddr];
}