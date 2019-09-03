// const authHelper = require('../helpers/authHelper');

function Client(ipAddr) {
    this.ipAddr = ipAddr;
    this.isAdmin = ipAddr.indexOf('127.0.0.1') !== -1 ? true : false;
}

Client.prototype.getStatus = function() {
    // return authHelper.isConnected(this);
}

module.exports = Client;