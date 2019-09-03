// this module one can be replaced by a db
const Client = require('./client');
const clients = [];

module.exports.getClient = function(ipAddr) {
    if (!clients[ipAddr]) {
        clients[ipAddr] = new Client(ipAddr);
    }

    return clients[ipAddr];
}

module.exports.getClients = function() {
    return Object.values(clients);
}